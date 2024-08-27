package com.ecommerce.services;

import com.ecommerce.entities.Pagamentos;
import com.ecommerce.entities.Pedidos;
import com.ecommerce.entities.Users;
import com.ecommerce.entities.dto.*;
import com.ecommerce.repository.PagamentosRepository;
import com.ecommerce.repository.PedidosRepository;
import com.ecommerce.repository.UsersRepository;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.common.IdentificationRequest;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.core.MPRequestOptions;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.net.HttpStatus;
import com.mercadopago.net.MPResponse;
import com.mercadopago.resources.payment.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.concurrent.CompletableFuture;

@Service
public class PagamentoService {

    @Value("${api.mercadoPago.serviceToken}")
    private String acessToken;

    @Autowired
    private PagamentosRepository repository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private PedidosRepository pedidosRepository;

    @Autowired
    @Lazy
    private PedidosService pedidosService;

    public List<Pagamentos> getAllPagamentos(String token) {
        Users user = usersRepository.findByLoginUser(authenticationService.getUserName(token));
        if (user != null)
        {
            boolean hasAdmin = user.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if(hasAdmin)
            {
                return repository.findAll();
            }
            else{
                throw new RuntimeException("É necessária uma hierárquia maior.");
            }
        }
        else{
            throw new RuntimeException("Ocorreu um erro ao tentar buscar o usuário.");
        }
    }

    private int calculatePontosCupcake(String idPedido, Users u)
    {
        try
        {
            Users user = authenticationService.getUserById(u.getIdUser());
            if (user != null)
            {
                Pedidos pedido = pedidosRepository.findById(idPedido)
                        .orElseThrow();
                int pontos = (int) pedido.getTotalPedido();
                authenticationService.updatePontosCupcake(user, pontos);
                return pontos;
            }
            else{
                throw new RuntimeException("Falha ao tentar buscar o usuario.\n");
            }
        }
        catch(Exception e)
        {
            throw new RuntimeException("Erro ao tentar registrar os pontos. " + e);
        }
    }

    public Pagamentos getPagamentoByPedido(Pedidos pedido)
    {
        Pagamentos pagamento = repository.findByPedido(pedido);
        if (pagamento != null)
        {
            return pagamento;
        }
        else{
            return null;
        }
    }

    public void insertPagamento(Pedidos pedido, Users user, Payment paymentResponse)
    {
        Pedidos p = pedidosService.getPedidoById(pedido.getIdPedido());
        if (p != null)
        {
            Pagamentos pagamento = getPagamentoByPedido(pedido);
            if (pagamento != null)
            {
                insertPagamentoExistente(pedido, user, pagamento, paymentResponse);
            }
            else {
                insertPagamentoInexistente(pedido, user, paymentResponse);
            }
        }
        else{
            throw new RuntimeException("Pedido não encontrado.");
        }
    }

    private ResponseEntity<String> insertPagamentoInexistente(Pedidos pedido, Users user, Payment paymentResponse) {
        if (authenticationService.getUserById(user.getIdUser()) != null)
        {
            try
            {
                Pagamentos pagamento = new Pagamentos();
                pagamento.setIdPagamentoMercadoPago(paymentResponse.getId());
                pagamento.setMetodoPagamento(paymentResponse.getPaymentMethodId());
                pagamento.setDataPagamento(paymentResponse.getDateApproved());
                pagamento.setStatusPagamento(paymentResponse.getStatus());
                pagamento.setStatusDetail(paymentResponse.getStatusDetail());
                pagamento.setUser(user);
                pagamento.setPedido(pedido);
                pagamento.setCreditado(false);
                repository.saveAndFlush(pagamento);
                return ResponseEntity.ok("Pagamento salvo com sucesso.");
            }
            catch (Exception e)
            {
                throw new RuntimeException("Falha ao tentar inserir o pagamento no banco de dados.\n" + e);
            }
        }
        else{
            throw new RuntimeException("Usuario inexistente.");
        }
    }

    private ResponseEntity<String> insertPagamentoExistente(Pedidos pedido, Users user, Pagamentos pagamento, Payment paymentResponse) {
        try
        {
            if (authenticationService.getUserById(user.getIdUser()) != null )
            {
                if (alreadyPayed(pedido.getIdPedido()) && !authenticationService.getUserById(user.getIdUser()).getAuthorities().contains("BALCAO"))
                {
                    if (!pagamento.isCreditado())
                    {
                        pagamento.setPontosGerados(calculatePontosCupcake(pedido.getIdPedido(), user));
                        pagamento.setCreditado(true);
                        repository.saveAndFlush(pagamento);
                        return ResponseEntity.ok("Pontos cupcake adicionados.");
                    }
                    else{
                        return ResponseEntity.ok("Os pontos já foram creditados.");
                    }
                }
                else{
                    try
                    {
                        pagamento.setAprovadoEm(paymentResponse.getDateApproved());
                        pagamento.setIdPagamentoMercadoPago(paymentResponse.getId());
                        pagamento.setMetodoPagamento(paymentResponse.getPaymentMethodId());
                        pagamento.setDataPagamento(paymentResponse.getDateLastUpdated());
                        pagamento.setStatusPagamento(paymentResponse.getStatus());
                        pagamento.setStatusDetail(paymentResponse.getStatusDetail());
                        pagamento.setUser(user);
                        pagamento.setPedido(pedido);
                        pagamento.setCreditado(false);
                        repository.saveAndFlush(pagamento);
                        return ResponseEntity.ok("Pagamento salvo com sucesso.");
                    }
                    catch (Exception e)
                    {
                        throw new RuntimeException("Falha ao tentar inserir o pagamento no banco de dados.\n" + e);
                    }
                }
            }
            else{
                throw new RuntimeException("Usuario inexistente.");
            }
        }
        catch(Exception e)
        {
            throw new RuntimeException("Erro em: " + e);
        }
    }


    private boolean alreadyPayed(String idPedido)
    {
        Pagamentos pagamento = repository.findByPedido(pedidosRepository.findById(idPedido).orElseThrow());
        if (pagamento != null)
        {
            if (pagamento.getStatusPagamento().equals("approved") && pagamento.getStatusDetail().equals("accredited"))
            {
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }

    public Object pagamentoPedido(pagamentoDTO dto) {
        if (alreadyPayed(dto.idPedido()))
        {
            return ResponseEntity.ok("Este pedido já foi pago.");
        }
        else{
            try
            {
                Users user = authenticationService.getUser(dto.token());
                Pedidos pedido = pedidosService.getPedidoById(dto.idPedido());
                if (user != null && pedido != null)
                {
                    MercadoPagoConfig.setAccessToken(acessToken);

                    Map<String, String> customHeaders = new HashMap<>();
                    customHeaders.put("x-idempotency-key", dto.idPedido());

                    MPRequestOptions requestOptions = MPRequestOptions.builder()
                            .customHeaders(customHeaders)
                            .build();

                    PaymentClient client = new PaymentClient();

                    OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
                    OffsetDateTime expirationDate = now.plus(Duration.ofMinutes(5));

                    PaymentCreateRequest paymentCreateRequest =
                            PaymentCreateRequest.builder()
                                    .transactionAmount(BigDecimal.valueOf(pedido.getTotalPedido())) // Amount to be paid
                                    .description("Pagamento maria amelia") // Description of the payment
                                    .paymentMethodId("pix") // Payment method ID for Pix
                                    .dateOfExpiration(expirationDate) // Expiration date
                                    .payer(
                                            PaymentPayerRequest.builder()
                                                    .email(user.getUserEmail())
                                                    .firstName(user.getUserFullName())
                                                    .identification(
                                                            IdentificationRequest.builder().type("CPF").number(user.getUserCpf()).build()) // Payer's identification
                                                    .build())
                                    .build();
                    Payment responsePagamento = client.create(paymentCreateRequest, requestOptions);
                    insertPagamento(pedido, user, responsePagamento);
                    checkPaymentAsync(pedido.getIdPedido(), dto.token());
                    return responsePagamento;
                }
                else if (user == null){
                    throw new RuntimeException("Usuario nao encontrado.");
                }
                else {
                    throw new RuntimeException("Erro nao detectado");
                }
            } catch (MPApiException e) {
                MPResponse response = e.getApiResponse();
                if (response != null) {
                    throw new RuntimeException("Response status code: " + response.getStatusCode() + "\n" + ": " + response.getContent());
                }
                throw new RuntimeException("API error: " + e.getMessage());
            } catch (MPException e) {
                throw new RuntimeException("Mercado Pago exception: " + e.getMessage());
            } catch (Exception e) {
                throw new RuntimeException("General exception: " + e.getMessage());
            }
        }

    }

    public Object pagamentoAvulso(pagamentoAvulsoDTO dto, Users user) {
        /*
            Explicacao:
            Durante os testes, para nao ser necessario logar o tempo inteiro, o pagamento automaticamente ja passa o balcao, e necessario retirar isto depois da fase de testes
         */
        /*
        Users user = authenticationService.getUser(dto.token());
        if (user == null)
        {
            throw new RuntimeException("Falha ao tentar recuperar o usuario");
        }
        */
        Pedidos pedido = pedidosService.pedidoBalcao(new PedidoAvulsoDTO(dto.produtos(), user));
        if (pedido != null)
        {
            try
            {
                MercadoPagoConfig.setAccessToken(acessToken);

                Map<String, String> customHeaders = new HashMap<>();
                customHeaders.put("x-idempotency-key", pedido.getIdPedido());

                MPRequestOptions requestOptions = MPRequestOptions.builder()
                        .customHeaders(customHeaders)
                        .build();

                PaymentClient client = new PaymentClient();

                OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
                OffsetDateTime expirationDate = now.plus(Duration.ofMinutes(5));

                PaymentCreateRequest paymentCreateRequest =
                        PaymentCreateRequest.builder()
                                .transactionAmount(BigDecimal.valueOf(pedido.getTotalPedido())) // Amount to be paid
                                .description("Pagamento maria amelia") // Description of the payment
                                .paymentMethodId("pix") // Payment method ID for Pix
                                .dateOfExpiration(expirationDate) // Expiration date
                                /*
                                .payer(
                                        PaymentPayerRequest.builder()
                                                .email(user.getUserEmail())
                                                .firstName(user.getUserFullName())
                                                .identification(
                                                        IdentificationRequest.builder().type("CPF").number(user.getUserCpf()).build()) // Payer's identification
                                                .build())
                                 */
                                .build();
                Payment responsePagamento = client.create(paymentCreateRequest, requestOptions);
                insertPagamento(pedido, user, responsePagamento);
                checkPaymentAsync(pedido.getIdPedido(), dto.token());
                return new responsePagamentoDTO(responsePagamento, pedido.getIdPedido());

            } catch (MPApiException e) {
                MPResponse response = e.getApiResponse();
                if (response != null) {
                    throw new RuntimeException("Response status code: " + response.getStatusCode() + "\n" + ": " + response.getContent());
                }
                throw new RuntimeException("API error: " + e.getMessage());
            } catch (MPException e) {
                throw new RuntimeException("Mercado Pago exception: " + e.getMessage());
            } catch (Exception e) {
                throw new RuntimeException("General exception: " + e.getMessage());
            }
        }
        else{
            throw new RuntimeException("Falha ao tentar criar o pedido");
        }
    }

    @Async
    public void checkPaymentAsync(String idPedido, String token) {
        checkPaymentServer(idPedido, token);
    }

    public void checkPaymentServer(String idPedido, String token) {
        for (int i=0; i <= 61; i++)
        {
            try {
                Pedidos pedido = pedidosService.getPedidoById(idPedido);
                if (pedido != null) {
                    MercadoPagoConfig.setAccessToken(acessToken);
                    PaymentClient client = new PaymentClient();

                    Long idPagamentoMercadoPago = getPagamentoByPedido(pedido).getIdPagamentoMercadoPago();

                    Payment response = client.get(idPagamentoMercadoPago);

                    if (response.getStatus().equals("approved")) {
                        if (response.getStatusDetail().equals("accredited")) {
                            insertPagamento(pedido, authenticationService.getUser(token), response);
                            break;
                        }
                    } else if (response.getStatus().equals("rejected")) {
                        throw new RuntimeException("Pagamento rejeitado");
                    } else{
                            Thread.sleep(5000);
                    }
                } else {
                    throw new RuntimeException("Pedido nao encontrado.");
                }
            } catch (MPApiException e) {
                MPResponse response = e.getApiResponse();
                if (response != null) {
                    throw new RuntimeException("Response status code: " + response.getStatusCode() + "\n" + ": " + response.getContent());
                }
                throw new RuntimeException("API error: " + e.getMessage());
            } catch (MPException e) {
                throw new RuntimeException("Mercado Pago exception: " + e.getMessage());
            } catch (Exception e) {
                throw new RuntimeException("General exception: " + e.getMessage());
            }
        }
    }

    public ResponseEntity<String> checkPaymentUser(String idPedido, String token) {
        for (int i=0; i <= 61; i++)
        {
            try {
                Pedidos pedido = pedidosService.getPedidoById(idPedido);
                if (pedido != null) {
                    MercadoPagoConfig.setAccessToken(acessToken);
                    PaymentClient client = new PaymentClient();

                    Long idPagamentoMercadoPago = getPagamentoByPedido(pedido).getIdPagamentoMercadoPago();

                    Payment response = client.get(idPagamentoMercadoPago);

                    if (response.getStatus().equals("approved")) {
                        if (response.getStatusDetail().equals("accredited")) {
                            insertPagamento(pedido, authenticationService.getUser(token), response);
                            return ResponseEntity.ok("Pagamento efetuado com sucesso");
                        }
                    } else if (response.getStatus().equals("rejected")) {
                        throw new RuntimeException("Pagamento rejeitado");
                    } else{
                        Thread.sleep(5000);
                    }
                } else {
                    throw new RuntimeException("Pedido nao encontrado.");
                }
            } catch (MPApiException e) {
                MPResponse response = e.getApiResponse();
                if (response != null) {
                    throw new RuntimeException("Response status code: " + response.getStatusCode() + "\n" + ": " + response.getContent());
                }
                throw new RuntimeException("API error: " + e.getMessage());
            } catch (MPException e) {
                throw new RuntimeException("Mercado Pago exception: " + e.getMessage());
            } catch (Exception e) {
                throw new RuntimeException("General exception: " + e.getMessage());
            }
        }
        return ResponseEntity.ofNullable("Pagamento nao efetuado");
    }
}
