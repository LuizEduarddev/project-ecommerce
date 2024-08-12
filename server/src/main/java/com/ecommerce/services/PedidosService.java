package com.ecommerce.services;

import com.ecommerce.entities.*;
import com.ecommerce.entities.dto.PedidosClienteDTO;
import com.ecommerce.entities.dto.ProductsDTO;
import com.ecommerce.entities.dto.ProductsOrderedDTO;
import com.ecommerce.entities.dto.pagamentoDTO;
import com.ecommerce.repository.MesaRepository;
import com.ecommerce.repository.PedidosRepository;
import com.ecommerce.repository.ProductsRepository;
import com.ecommerce.repository.UsersRepository;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.common.IdentificationRequest;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.core.MPRequestOptions;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.net.MPResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PedidosService {

    @Autowired
    private ProductsRepository productsRepository;

    @Autowired
    private PedidosRepository repository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private MesaRepository mesaRepository;

    @Autowired
    private AuthenticationService authenticationService;

    public List<Pedidos> getAllPedidos(String token)
    {
        Users user = usersRepository.findByLoginUser(authenticationService.getUserName(token));
        boolean hasCozinha = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_COZINHA-CAFE"));
        boolean hasAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        boolean hasGarcom = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_GARCOM"));

        if (hasCozinha|| hasAdmin || hasGarcom)
        {
            return repository.findAll();
        }
        else {
            throw new RuntimeException("Requerido uma permissão maior.");
        }

    }

    public List<Pedidos> getPedidoByMesa(Mesa mesa)
    {
        try
        {
            return repository.findByMesa(mesa);
        }
        catch(Exception e)
        {
            throw new RuntimeException("Um erro ocorreu ao tentar buscar os pedidos pela mesa.\n" + e);
        }
    }

    @Transactional
    public Pedidos getPedidoById(String id, String token)
    {
        if (checkUserAuthority(token) == HttpStatus.ACCEPTED) return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido nao encontrado."));
        else{
            throw new RuntimeException("É necessária uma permissao maior para esta acao.");
        }
    }

    @Transactional
    public ResponseEntity<String> addPedidoDelivery(List<ProductsDTO> products, String tokenUser)
    {
        if (products.isEmpty())
        {
            throw new RuntimeException("Não é possível fazer um pedido com o carrinho vazio!");
        }
        List<Products> produtos = new ArrayList<>();
        products.forEach((prod) -> {
            produtos.add(productsRepository.findById(prod.idProd())
                    .orElseThrow(() -> new RuntimeException("Produto nao encontrado no sistema\nFalha para criar pedido")));
        });

        Users user = usersRepository.findByLoginUser(authenticationService.getUserName(tokenUser));
        if (user == null)
        {
            throw new RuntimeException("Falha ao tentar pegar o usuario em 'addPedidoDelivery'");
        }

        try
        {
            LocalTime currentTime = LocalTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
            String formattedTime = currentTime.format(formatter);
            Pedidos pedido = new Pedidos();
            Date dataAtual = new Date();
            SimpleDateFormat formatDate = new SimpleDateFormat("dd-MM-yyyy");
            String dataFormatada = formatDate.format(dataAtual);
            pedido.setDataPedido(dataFormatada);

            pedido.setHoraPedido(formattedTime);

            pedido.setPedidoPago(false);
            pedido.setPedidoPronto(false);

            double total = produtos.stream().mapToDouble(Products::getPrecoProd).sum();

            pedido.setTotalPedido(total);

            pedido.setProdutos(produtos);
            pedido.setUsers(user);

            repository.saveAndFlush(pedido);

            return ResponseEntity.ok("Pedido criado com sucesso");
        }
        catch(Exception e)
        {
            return ResponseEntity.badRequest().body("Falha ao tentar criar pedido.\nErro: " + e);
        }
    }

    public ResponseEntity<String> addPedido(List<String> idProdutos, String idUser, String idMesa)
    {
        List<Products> produtos = new ArrayList<>();
        idProdutos.forEach((id) -> {
            produtos.add(productsRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Produto nao encontrado no sistema\nFalha para criar pedido")));
        });

        Users user = usersRepository.findById(idUser)
                .orElseThrow(() -> new RuntimeException("Cliente nao encontrado no sistema.\nFalha para criar pedido"));

        Mesa mesa = mesaRepository.findById(idMesa)
                .orElseThrow(() -> new RuntimeException("Mesa nao encontrada no sistema.\nFalha para criar pedido"));

        try
        {
            LocalTime currentTime = LocalTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
            String formattedTime = currentTime.format(formatter);
            Pedidos pedido = new Pedidos();
            Date dataAtual = new Date();
            SimpleDateFormat formatDate = new SimpleDateFormat("dd-MM-yyyy");
            String dataFormatada = formatDate.format(dataAtual);
            pedido.setDataPedido(dataFormatada);

            pedido.setHoraPedido(formattedTime);

            pedido.setPedidoPago(false);
            pedido.setPedidoPronto(false);

            double total = produtos.stream().mapToDouble(Products::getPrecoProd).sum();

            pedido.setTotalPedido(total);

            pedido.setProdutos(produtos);
            pedido.setUsers(user);

            pedido.setMesa(mesa);

            repository.saveAndFlush(pedido);

            return ResponseEntity.ok("Pedido criado com sucesso");
        }
        catch(Exception e)
        {
            return ResponseEntity.badRequest().body("Falha ao tentar criar pedido.\nErro: " + e);
        }
    }

    private HttpStatus checkUserAuthorityAdmin(String token)
    {
        Users user = usersRepository.findByLoginUser(authenticationService.getUserName(token));
        if (user != null)
        {
            boolean hasAdmin = user.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (hasAdmin) return HttpStatus.ACCEPTED;
            else {
                return HttpStatus.FAILED_DEPENDENCY;
            }
        }
        else{
            throw new RuntimeException("Houve um erro ao tentar buscar o usuário.");
        }
    }

    private HttpStatus checkUserAuthority(String token)
    {
        Users user = usersRepository.findByLoginUser(authenticationService.getUserName(token));
        if (user != null)
        {
            boolean hasCozinha = user.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_COZINHA-CAFE"));
            boolean hasGarcom = user.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_GARCOM"));
            if (hasCozinha || hasGarcom) return HttpStatus.ACCEPTED;
            else {
                return HttpStatus.FAILED_DEPENDENCY;
            }
        }
        else{
            throw new RuntimeException("Houve um erro ao tentar buscar o usuário.");
        }
    }

    public ResponseEntity<String> setPedidoPronto(String idPedido, String token)
    {
        try
        {
            Pedidos pedido = repository.findById(idPedido)
                    .orElseThrow(() -> new RuntimeException("Pedido nao encontrado no sistema.\nFalha para alterar para pedido pronto."));

            if (checkUserAuthority(token) == HttpStatus.ACCEPTED)
            {
                pedido.setPedidoPronto(true);
                repository.saveAndFlush(pedido);
                return ResponseEntity.ok("Pedido foi alterado para pronto.");
            }
            else{
                throw new RuntimeException("É necessário uma autoridade maior para executar esta acao");
            }
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body("Falha ao tentar mudar o status do pedido para pronto.\nError: "  + e);
        }
    }

    public ResponseEntity<String> setPedidoPago(String idPedido)
    {
        try
        {
            Pedidos pedido = repository.findById(idPedido)
                    .orElseThrow(() -> new RuntimeException("Pedido nao encontrado no sistema.\nFalha para alterar para pedido pronto."));

            pedido.setPedidoPago(true);
            calculatePontosCupcake(pedido, pedido.getUsers());
            repository.saveAndFlush(pedido);
            return ResponseEntity.ok("Pedido foi alterado para pronto.");
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body("Falha ao tentar mudar o status do pedido para pronto.\nError: "  + e);
        }
    }

    private void calculatePontosCupcake(Pedidos pedido, Users u)
    {
        try
        {
            Users user = usersRepository.findByLoginUser(u.getUsername());
            if (user != null)
            {
                int pontos = (int) pedido.getTotalPedido();
                user.setPontosCupcake(pontos);
            }
        }
        catch(Exception e)
        {
            throw new RuntimeException("Erro ao tentar registrar os pontos. " + e);
        }
    }

    @Transactional
    public List<PedidosClienteDTO> getPedidoByUser(String token) {
        Users user = usersRepository.findByLoginUser(authenticationService.getUserName(token));
        if (user == null) {
            throw new RuntimeException("Não foi possível localizar o usuário");
        } else {
            List<Pedidos> pedidos = repository.findByUsers(user);
            if (!pedidos.isEmpty()) {
                return pedidos.stream().map(this::convertToDTO).collect(Collectors.toList());
            } else {
                return new ArrayList<>();
            }
        }
    }

    private PedidosClienteDTO convertToDTO(Pedidos pedido) {
        List<ProductsOrderedDTO> productsDTOList = pedido.getProdutos().stream()
                .map(product -> new ProductsOrderedDTO(
                        product.getIdProd(),
                        product.getNomeProd(),
                        product.getPrecoProd()
                ))
                .collect(Collectors.toList());

        return new PedidosClienteDTO(
                pedido.getIdPedido(),
                pedido.getDataPedido(),
                pedido.getHoraPedido(),
                pedido.getTotalPedido(),
                pedido.isPedidoPago(),
                productsDTOList
        );
    }

    public PedidosAdminDTO getAllPedidosAdmin(String token) {
        if (checkUserAuthorityAdmin(token) == HttpStatus.ACCEPTED)
        {
            List<Pedidos> pedidosList = repository.findAll();
            double total = pedidosList.stream().mapToDouble(Pedidos::getTotalPedido).sum();
            return new PedidosAdminDTO(pedidosList, total);
        }
        else{
            throw new RuntimeException("É necessária uma hierarquia maior para acessar esta página.");
        }
    }

    @Transactional
    public List<PedidosClienteDTO> getPedidosPendentes(String token) {
        Users user = usersRepository.findByLoginUser(authenticationService.getUserName(token));
        if (user != null) {
            Optional<List<Pedidos>> pedidosOptional = repository.findByUsersAndPedidoPagoFalse(user);

            return pedidosOptional
                    .map(pedidos -> pedidos.stream()
                            .map(this::convertToDTO)
                            .collect(Collectors.toList()))
                    .orElseGet(Collections::emptyList);
        } else {
            throw new RuntimeException("Usuario nao encontrado");
        }
    }

    public Object pagamentoPedido(pagamentoDTO dto) {
        try
        {

            MercadoPagoConfig.setAccessToken("APP_USR-4129274862422289-080918-960547adee80eba3e345da9eb2f51feb-1940516742");

            // Set custom headers
            Map<String, String> customHeaders = new HashMap<>();
            customHeaders.put("x-idempotency-key", dto.idPedido());

            MPRequestOptions requestOptions = MPRequestOptions.builder()
                    .customHeaders(customHeaders)
                    .build();

            // Create a PaymentClient instance
            PaymentClient client = new PaymentClient();

            OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
            OffsetDateTime expirationDate = now.plus(Duration.ofMinutes(5));

            // Create a PaymentCreateRequest object
            PaymentCreateRequest paymentCreateRequest =
                    PaymentCreateRequest.builder()
                            .transactionAmount(dto.totalPedido()) // Amount to be paid
                            .description("Pagamento maria amelia") // Description of the payment
                            .paymentMethodId("pix") // Payment method ID for Pix
                            .dateOfExpiration(expirationDate) // Expiration date
                            .payer(
                                    PaymentPayerRequest.builder()
                                            .email(dto.userEmail())
                                            .firstName(dto.userEmail())
                                            .identification(
                                                    IdentificationRequest.builder().type("CPF").number(dto.cpf()).build()) // Payer's identification
                                            .build())
                            .build();
            functionGetPaymenteAprovved(dto.idPedido(), "APP_USR-4129274862422289-080918-960547adee80eba3e345da9eb2f51feb-1940516742", expirationDate);
            return client.create(paymentCreateRequest, requestOptions);
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

    private void functionGetPaymenteAprovved(String idPedido, String acessToken, OffsetDateTime expirationDate) {

    }
}
