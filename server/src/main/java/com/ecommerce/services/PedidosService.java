package com.ecommerce.services;

import com.ecommerce.entities.*;
import com.ecommerce.entities.dto.*;
import com.ecommerce.repository.MesaRepository;
import com.ecommerce.repository.PedidosRepository;
import com.ecommerce.repository.ProductsRepository;
import com.ecommerce.repository.UsersRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
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

    @Autowired
    private PagamentoService pagamentoService;

    @Autowired
    private MesaService mesaService;

    final String acessToken = "";

    public List<Pedidos> getAllPedidos()
    {
        return repository.findAll();
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
    public Pedidos getPedidoById(String id)
    {
        return repository.findById(id)
                .orElseThrow();
    }

    public ResponseEntity<String> addPedido(addPedidoDTO dto)
    {
        //AUTENTICACAO FUNCIONANDO
        /*
        if (dto.produtos().isEmpty())
        {
            throw new RuntimeException("Não é possível fazer um pedido com o carrinho vazio!");
        }
        List<Products> produtos = new ArrayList<>();
        dto.produtos().forEach((prod) -> {
            produtos.add(productsRepository.findById(prod.idProd())
                    .orElseThrow(() -> new RuntimeException("Produto nao encontrado no sistema\nFalha para criar pedido")));
        });

        Users user = authenticationService.getUser(dto.token());
        if (user == null)
        {
            throw new RuntimeException("Falha ao tentar pegar o usuario em 'addPedidoDelivery'");
        }
        if(user.getAuthorities().contains("ROLE_GARCOM"))
        {
            if (!dto.idMesa().isEmpty())
            {
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

                    pedido.setPedidoProntoCozinha(false);

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
            else{
                return ResponseEntity.ok("É necessário informar a mesa.");
            }
        }
        else {
            return ResponseEntity.ok("Necessário uma hierárquia maior");
        }

         */
        if (dto.produtos().isEmpty())
        {
            throw new RuntimeException("Não é possível fazer um pedido com o carrinho vazio!");
        }
        AtomicReference<Double> total = new AtomicReference<>(0.0);
        List<ProductsPedidosDTO> productsPedidosDTOS = new ArrayList<>();
        dto.produtos().forEach(prod -> {
            Products produto = productsRepository.findById(prod.idProd())
                    .orElseThrow(() -> new RuntimeException("Produto nao encontrado no sistema\nFalha para criar pedido"));
            productsPedidosDTOS.add(new ProductsPedidosDTO(produto, prod.quantidade()));
            total.updateAndGet(t -> t + produto.getPrecoProd() * prod.quantidade());
        });
        double finalTotal = total.get();
        if (!dto.idMesa().isBlank())
        {
            Mesa mesa = mesaService.getMesaFullById(dto.idMesa());
            if (mesa != null)
            {
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

                    pedido.setPedidoPronto(false);
                    pedido.setPedidoProntoBalcao(false);
                    pedido.setPedidoProntoCozinha(false);

                    pedido.setTotalPedido(finalTotal);

                    pedido.setProdutos(productsPedidosDTOS);
                    pedido.setUsers(null);
                    pedido.setMesa(mesa);
                    pedido.setCpfClientePedido(dto.cpfClientePedido());
                    pedido.setHoraPronto(null);

                    mesaService.alterMesaEmUso(dto.idMesa());

                    repository.saveAndFlush(pedido);

                    return ResponseEntity.ok("Pedido criado com sucesso");
                }
                catch(Exception e)
                {
                    return ResponseEntity.badRequest().body("Falha ao tentar criar pedido.\nErro: " + e);
                }
            }
            else{
                return ResponseEntity.ofNullable("Mesa não encontrada no sistema.");
            }
        }
        else{
            throw new RuntimeException("E necessario informar a mesa");
        }
    }

    public Pedidos pedidoBalcao(PedidoAvulsoDTO dto) {
        if (dto.produtos().isEmpty())
        {
            throw new RuntimeException("Não é possível fazer um pedido com o carrinho vazio!");
        }
        AtomicReference<Double> total = new AtomicReference<>(0.0);
        List<ProductsPedidosDTO> productsPedidosDTOS = new ArrayList<>();
        dto.produtos().forEach(prod -> {
            Products produto = productsRepository.findById(prod.idProd())
                    .orElseThrow(() -> new RuntimeException("Produto nao encontrado no sistema\nFalha para criar pedido"));
            productsPedidosDTOS.add(new ProductsPedidosDTO(produto, prod.quantidade()));
            total.updateAndGet(t -> t + produto.getPrecoProd() * prod.quantidade());
        });
        double finalTotal = total.get();
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

            pedido.setPedidoPronto(false);
            pedido.setPedidoProntoBalcao(false);
            pedido.setPedidoProntoCozinha(false);

            pedido.setTotalPedido(finalTotal);

            pedido.setProdutos(productsPedidosDTOS);
            pedido.setUsers(dto.user());
            pedido.setMesa(null);

            repository.saveAndFlush(pedido);

            return pedido;
        }
        catch(Exception e)
        {
            throw new RuntimeException("Falha ao tentar criar pedido.\nErro: " + e);
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
            List<Collection<? extends GrantedAuthority>> authorits = Collections.singletonList(authenticationService.getPermission(token));

            Pedidos pedido = repository.findById(idPedido)
                    .orElseThrow(() -> new RuntimeException("Pedido nao encontrado no sistema.\nFalha para alterar para pedido pronto."));

            boolean hasCozinhaRole = authorits.stream()
                    .flatMap(Collection::stream)
                    .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_COZINHA"));

            boolean hasBalcaoPreparo = authorits.stream()
                    .flatMap(Collection::stream)
                    .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_BALCAOPREPARO"));

            if (hasCozinhaRole)
            {
                if (pedido.isPedidoProntoBalcao())
                {
                    pedido.setPedidoPronto(true);
                    pedido.setPedidoProntoCozinha(true);
                }
                else{
                    pedido.setPedidoProntoCozinha(true);
                }
                LocalTime currentTime = LocalTime.now();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
                String formattedTime = currentTime.format(formatter);
                pedido.setHoraPronto(formattedTime);
                repository.saveAndFlush(pedido);
                return ResponseEntity.ok("Pedido foi alterado para pronto.");
            }
            else if (hasBalcaoPreparo)
            {
                if (pedido.isPedidoProntoCozinha())
                {
                    pedido.setPedidoPronto(true);
                    pedido.setPedidoProntoBalcao(true);
                }
                else{
                    pedido.setPedidoProntoBalcao(true);
                }
                LocalTime currentTime = LocalTime.now();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
                String formattedTime = currentTime.format(formatter);
                pedido.setHoraPronto(formattedTime);
                repository.saveAndFlush(pedido);
                return ResponseEntity.ok("Pedido foi alterado para pronto.");
            }
            else{
                throw new RuntimeException("Falha ao capturar o local de preparo");
            }
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body("Falha ao tentar mudar o status do pedido para pronto.\nError: "  + e);
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

    @Transactional
    public List<PedidosClienteDTO> getPedidoByUserAndMesa(String idMesa, String token) {
        Users user = authenticationService.getUser(token);
        if (user == null) {
            throw new RuntimeException("Não foi possível localizar o usuário");
        } else {
            List<Pedidos> pedidos = repository.findByUsersAndMesa(user, mesaRepository.findById(idMesa).orElseThrow());
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
                        product.getProduto().getIdProd(),  // Ensure getId() is used to retrieve product ID
                        product.getQuantidade()        // Ensure getQuantidade() is used to retrieve quantity
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
            List<Pedidos> pedidosList = repository.findByUsers(user);

            return pedidosList.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } else {
            throw new RuntimeException("Usuario nao encontrado");
        }
    }

    public ResponseEntity<String> setPedidoPago(String token, String idPedido) {
        Pedidos pedido = repository.findById(idPedido)
                .orElseThrow();
        if (pedido.getUsers() == authenticationService.getUser(token)) {
            pedido.setPedidoPago(true);
            return ResponseEntity.ok("Pagamento efetuado com sucesso");
        } else {
           return ResponseEntity.badRequest().body("Impossível alterar o pedido");
        }
    }

    public boolean pedidoPendente(String idMesa, String token) {
        Mesa mesa = mesaService.getMesaFullById(idMesa);
        if (repository.findByUsersAndMesaAndPedidoPagoFalse(authenticationService.getUser(token), mesa) != null)
        {
            return true;
        }
        else{
            return false;
        }
    }

    @Transactional
    public MesaDTO getPedidoByMesaDTO(GetPedidoDTO dto) {
        try
        {
            if (dto.idMesa() == null || dto.idMesa().isEmpty()) {
                return null;
            }

            Mesa mesa = mesaService.getMesaFullById(dto.idMesa());
            if (mesa == null) {
                return null;
            }

            List<Pedidos> pedidosList = repository.findByMesa(mesa).stream()
                    .filter(pedido -> !pedido.isPedidoPago())
                    .toList();

            List<PedidosMesaDTO> pedidosMesaDTOList = pedidosList.stream()
                    .map(pedido -> {
                        List<ProductsMesaDTO> produtosMesaDTOList = pedido.getProdutos().stream()
                                .map(produto -> new ProductsMesaDTO(produto.getProduto().getIdProd(), produto.getProduto().getNomeProd(), produto.getProduto().getPrecoProd(), produto.getQuantidade()))
                                .collect(Collectors.toList());

                        return new PedidosMesaDTO(pedido.getIdPedido(), pedido.isPedidoPronto(),produtosMesaDTOList);
                    })
                    .collect(Collectors.toList());

            double valorTotal = pedidosList.stream()
                    .mapToDouble(Pedidos::getTotalPedido)
                    .sum();

            return new MesaDTO(pedidosMesaDTOList, valorTotal);
        }
        catch(Exception e)
        {
            throw new RuntimeException("Erro: " + e);
        }
    }

    @Transactional
    public MesaDTO getPedidoByCpf(String cpf) {
        try {
            if (cpf == null) {
                return null;
            }

            List<Pedidos> pedidosList = repository.findByCpfClientePedido(cpf);

            List<PedidosMesaDTO> pedidosMesaDTOList = pedidosList.stream()
                    .filter(pedido -> isToday(pedido.getDataPedido()))
                    .map(pedido -> {
                        List<ProductsMesaDTO> produtosMesaDTOList = pedido.getProdutos().stream()
                                .map(produto -> new ProductsMesaDTO(
                                        produto.getProduto().getIdProd(),
                                        produto.getProduto().getNomeProd(),
                                        produto.getProduto().getPrecoProd(),
                                        produto.getQuantidade()
                                ))
                                .collect(Collectors.toList());

                        return new PedidosMesaDTO(pedido.getIdPedido(), pedido.isPedidoPronto(), produtosMesaDTOList);
                    })
                    .collect(Collectors.toList());

            double valorTotal = pedidosList.stream()
                    .filter(pedido ->isToday(pedido.getDataPedido()))
                    .mapToDouble(Pedidos::getTotalPedido)
                    .sum();

            return new MesaDTO(pedidosMesaDTOList, valorTotal);
        } catch (Exception e) {
            throw new RuntimeException("Erro: " + e);
        }
    }


    @Transactional
    public List<PedidoCozinhaDTO> getPedidoForCozinha() {
        List<Pedidos> pedidos = repository.findAll();
        return pedidos.stream()
                .filter(pedido -> isToday(pedido.getDataPedido()))
                .map(this::filterAndConvertToPedidoCozinhaDTO)
                .filter(dto -> !dto.produtos().isEmpty())
                .collect(Collectors.toList());
    }

    private boolean isToday(String dataPedido) {
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        String formattedToday = today.format(formatter);
        return dataPedido.equals(formattedToday);
    }


    private PedidoCozinhaDTO filterAndConvertToPedidoCozinhaDTO(Pedidos pedido) {
        List<PedidoCozinhaProdutosDTO> produtosCozinhaDTO = pedido.getProdutos().stream()
                .filter(produtosPedido -> produtosPedido.getProduto().getCategoriaProd().getValue().equalsIgnoreCase("cozinha"))
                .map(produtosPedido -> new PedidoCozinhaProdutosDTO(
                        produtosPedido.getProduto().getIdProd(),
                        produtosPedido.getProduto().getNomeProd(),
                        produtosPedido.getQuantidade()
                ))
                .collect(Collectors.toList());


        return new PedidoCozinhaDTO(
                pedido.getIdPedido(),
                pedido.getHoraPedido(),
                pedido.getHoraPronto(),
                pedido.isPedidoProntoCozinha(),
                produtosCozinhaDTO
        );
    }


    @Transactional
    public List<PedidoCozinhaDTO> getPedidoForBalcaoPreparo() {
        List<Pedidos> pedidos = repository.findAll();
        return pedidos.stream()
        .filter(pedido -> isToday(pedido.getDataPedido())
        )
        .map(this::filterAndConvertToPedidoCozinhaDTOBalcao)
        .filter(dto -> !dto.produtos().isEmpty()
        )
        .collect(Collectors.toList());
    }

    private PedidoCozinhaDTO filterAndConvertToPedidoCozinhaDTOBalcao(Pedidos pedido) {
        //PROBLEMA ESTA DENTRO DESTE LIST, VERIFICAR O POR QUE
        List<PedidoCozinhaProdutosDTO> produtosCozinhaDTO = pedido.getProdutos().stream()
                .filter(produtosPedido -> !produtosPedido.getProduto().getCategoriaProd().getValue().equalsIgnoreCase("cozinha"))
                .map(produtosPedido -> new PedidoCozinhaProdutosDTO(
                        produtosPedido.getProduto().getIdProd(),
                        produtosPedido.getProduto().getNomeProd(),
                        produtosPedido.getQuantidade()
                ))
                .collect(Collectors.toList());

        return new PedidoCozinhaDTO(
                pedido.getIdPedido(),
                pedido.getHoraPedido(),
                pedido.getHoraPronto(),
                pedido.isPedidoProntoBalcao(),
                produtosCozinhaDTO
        );
    }
}
