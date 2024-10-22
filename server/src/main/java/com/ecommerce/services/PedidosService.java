package com.ecommerce.services;

import com.ecommerce.entities.*;
import com.ecommerce.entities.dto.*;
import com.ecommerce.entities.errors.EmpresasException;
import com.ecommerce.entities.errors.MesaException;
import com.ecommerce.entities.errors.PedidoException;
import com.ecommerce.entities.errors.ProductsException;
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
    private MesaService mesaService;

    public List<Pedidos> getAllPedidos()
    {
        return repository.findAll();
    }

    @Transactional
    public List<Pedidos> getPedidoByListIdAndEmpresa(List<String> listId, String token)
    {
        Empresas empresa = authenticationService.getEmpresaByToken(token);
        if (empresa == null) throw new PedidoException("Falha na autenticação");
        try
        {
            List<Pedidos> retorno = new ArrayList<>();
            listId.forEach(pedido -> {
                Pedidos pedido1 = repository.findByIdPedidoAndEmpresa(pedido, empresa);
                if (pedido1 == null) throw new PedidoException("Falha ao tentar buscar o pedido");
                retorno.add(pedido1);
            });
            return retorno;
        }
        catch (Exception e)
        {
            throw new PedidoException("Falha ao tentar buscar os pedidos.");
        }
    }

    public Pedidos addPedidoAvulso(addPedidoPagamentoDTO dto, String token)
    {
        if (dto.produtos().isEmpty())
        {
            throw new RuntimeException("Não é possível fazer um pedido com o carrinho vazio!");
        }
        AtomicReference<Double> total = new AtomicReference<>(0.0);
        List<ProductsPedidosDTO> productsPedidosDTOS = new ArrayList<>();
        Empresas empresa = authenticationService.getEmpresaByToken(token);
        if (empresa == null)
        {
            throw new PedidoException("Falha ao autenticar.");
        }
        dto.produtos().forEach(prod -> {
            Products produto = productsRepository.findByIdProdAndEmpresa(prod.idProd(), empresa);
            if (produto == null)
            {
                throw new ProductsException("Falha ao buscar o produto.");
            }
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
            pedido.setUsers(null);
            pedido.setMesa(null);
            pedido.setCpfClientePedido(dto.cpfCliente());
            pedido.setHoraPronto(null);
            pedido.setPedidoPago(true);
            pedido.setEmpresa(empresa);
            repository.saveAndFlush(pedido);

            return pedido;
        }
        catch(Exception e)
        {
            throw new PedidoException("Falha ao tentar criar pedido.\nErro: " + e);
        }
    }

    @Transactional
    public ResponseEntity<String> addPedido(addPedidoDTO dto) {
        if (dto.produtos().isEmpty()) {
            throw new PedidoException("Não é possível fazer um pedido com o carrinho vazio!");
        }

        AtomicReference<Double> total = new AtomicReference<>(0.0);
        List<ProductsPedidosDTO> productsPedidosDTOS = new ArrayList<>();

        Empresas empresa = authenticationService.getEmpresaByToken(dto.token());
        if (empresa == null)
        {
            throw new PedidoException("Falha ao autenticar.");
        }
        dto.produtos().forEach(prod -> {
            Products produto = productsRepository.findByIdProdAndEmpresa(prod.idProd(), empresa);
            if (produto == null) throw new ProductsException("Falha ao tentar pegar o produto.");
            double produtoPreco = produto.isPromoProd() ? produto.getPrecoPromocao() : produto.getPrecoProd();

            productsPedidosDTOS.add(new ProductsPedidosDTO(produto, prod.quantidade()));
            total.updateAndGet(t -> t + produtoPreco * prod.quantidade());
        });

        double finalTotal = total.get();

        if (!dto.idMesa().isBlank()) {
            Mesa mesa = mesaService.getMesaFullByIdAndEmpresa(dto.idMesa(), empresa);
            if (mesa != null) {
                try {
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
                        pedido.setLevouParaMesa(false);
                        pedido.setEmpresa(empresa);
                        mesaService.alterMesaEmUso(dto.idMesa());
                        repository.saveAndFlush(pedido);
                        return ResponseEntity.ok("Pedido criado com sucesso");
                } catch (Exception e) {
                    throw new PedidoException("Falha ao tentar criar pedido.\nErro: " + e);
                }
            } else {
                throw new PedidoException("Mesa não encontrada no sistema.");
            }
        } else {
            throw new PedidoException("É necessário informar a mesa");
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

    /*
    @Transactional
    public ResponseEntity<String> setPedidoPronto(String idPedido, String token) {
        Empresas empresa = authenticationService.getEmpresaByToken(token);
        if (empresa != null)
        {
            try {
                List<Collection<? extends GrantedAuthority>> authorities = Collections.singletonList(authenticationService.getPermission(token));

                Pedidos pedido = repository.findById(idPedido)
                        .orElseThrow(() -> new RuntimeException("Pedido não encontrado no sistema.\nFalha ao alterar para pedido pronto."));

                boolean hasCozinhaRole = authorities.stream()
                        .flatMap(Collection::stream)
                        .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_COZINHA"));

                boolean hasBalcaoPreparoRole = authorities.stream()
                        .flatMap(Collection::stream)
                        .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_BALCAOPREPARO"));

                boolean hasBalcaoProducts = pedido.getProdutos().stream()
                        .anyMatch(prod -> prod.getProduto().getCategoriaProd() != CategoriaProd.COZINHA);

                boolean hasCozinhaProducts = pedido.getProdutos().stream()
                        .anyMatch(prod -> prod.getProduto().getCategoriaProd() == CategoriaProd.COZINHA);

                if (hasCozinhaRole && hasCozinhaProducts) {
                    if (hasBalcaoProducts && pedido.isPedidoProntoBalcao()) {
                        pedido.setPedidoPronto(true);
                        pedido.setPedidoProntoCozinha(true);
                        setHoraPronto(pedido);
                    }
                    else if (!hasBalcaoProducts)
                    {
                        pedido.setPedidoPronto(true);
                        pedido.setPedidoProntoCozinha(true);
                        setHoraPronto(pedido);
                    }
                    else {
                        pedido.setPedidoProntoCozinha(true);
                    }
                    repository.saveAndFlush(pedido);
                    return ResponseEntity.ok("Pedido foi alterado para pronto.");
                }
                else if (hasBalcaoPreparoRole && hasBalcaoProducts) {
                    if (hasCozinhaProducts && pedido.isPedidoProntoCozinha()) {
                        pedido.setPedidoPronto(true);
                        pedido.setPedidoProntoBalcao(true);
                        setHoraPronto(pedido);
                    }
                    else if(!hasCozinhaProducts)
                    {
                        pedido.setPedidoPronto(true);
                        pedido.setPedidoProntoBalcao(true);
                        setHoraPronto(pedido);
                    }
                    else {
                        pedido.setPedidoProntoBalcao(true);
                    }
                    repository.saveAndFlush(pedido);
                    return ResponseEntity.ok("Pedido foi alterado para pronto.");
                }
                else {
                    throw new RuntimeException("Falha ao capturar o local de preparo ou produtos não correspondem ao local de preparo.");
                }
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Falha ao tentar mudar o status do pedido para pronto.\nError: " + e.getMessage());
            }
        }
        else{
            throw new PedidoException("Falha ao autenticar.");
        }
    }

    private void setHoraPronto(Pedidos pedido) {
        LocalTime currentTime = LocalTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        String formattedTime = currentTime.format(formatter);
        pedido.setHoraPronto(formattedTime);
    }


     */

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
                        product.getProduto().getIdProd(),
                        product.getQuantidade()
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

    @Transactional
    public MesaDTO getPedidoByMesaDTO(GetPedidoDTO dto) {
        Empresas empresa = authenticationService.getEmpresaByToken(dto.token());
        if (empresa != null)
        {
            try
            {
                if (dto.idMesa() == null || dto.idMesa().isEmpty()) {
                    return null;
                }

                Mesa mesa = mesaService.getMesaFullByIdAndEmpresa(dto.idMesa(), empresa);
                if (mesa == null) {
                    throw new MesaException("Falha ao tentar buscar a mesa");
                }

                List<Pedidos> pedidosList = repository.findByMesaAndEmpresa(mesa, empresa).stream()
                        .filter(pedido -> !pedido.isPedidoPago())
                        .toList();

                List<PedidosMesaDTO> pedidosMesaDTOList = pedidosList.stream()
                        .map(pedido -> {
                            List<ProductsMesaDTO> produtosMesaDTOList = pedido.getProdutos().stream()
                                    .map(produto -> new ProductsMesaDTO(produto.getProduto().getIdProd(), produto.getProduto().getNomeProd(), produto.getProduto().getPrecoProd(), produto.getQuantidade()))
                                    .collect(Collectors.toList());

                            return new PedidosMesaDTO(pedido.getIdPedido(), pedido.isPedidoPronto(),produtosMesaDTOList, pedido.getCpfClientePedido());
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
        else{
            throw new PedidoException("Falha ao autenticar");
        }
    }

    @Transactional
    public MesaDTO getPedidoByCpf(GetByCpfDTO dto) {
        Empresas empresa = authenticationService.getEmpresaByToken(dto.token());
        if (empresa != null)
        {
            try {
                if (dto.cpfCliente() == null) {
                    return null;
                }

                List<Pedidos> pedidosList = repository.findByCpfClientePedidoAndEmpresa(dto.cpfCliente(), empresa);

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

                            return new PedidosMesaDTO(pedido.getIdPedido(), pedido.isPedidoPronto(), produtosMesaDTOList, pedido.getCpfClientePedido());
                        })
                        .collect(Collectors.toList());

                double valorTotal = pedidosList.stream()
                        .filter(pedido ->isToday(pedido.getDataPedido()))
                        .mapToDouble(Pedidos::getTotalPedido)
                        .sum();

                return new MesaDTO(pedidosMesaDTOList, valorTotal);
            } catch (Exception e) {
                throw new PedidoException("Erro ao tentar buscar os pedidos do cliente.");
            }
        }
        else{
            throw new PedidoException("Falha ao autenticar");
        }
    }


    /*
    @Transactional
    public List<PedidoCozinhaDTO> getPedidoForCozinha(String token) {
        try
        {
            Empresas empresa = authenticationService.getEmpresaByToken(token);
            if (empresa != null)
            {
                List<Pedidos> pedidos = repository.findByEmpresa(empresa);
                return pedidos.stream()
                        .filter(pedido -> isToday(pedido.getDataPedido()))
                        .map(this::filterAndConvertToPedidoCozinhaDTO)
                        .filter(dto -> !dto.produtos().isEmpty())
                        .collect(Collectors.toList());
            }
            else{
                throw new PedidoException("Falha ao tentar buscar os pedidos da cozinha.");
            }
        }
        catch(Exception e)
        {
            throw new EmpresasException("Erro ao tentar pegar os pedidos para a cozinha");
        }
    }

     */

    private boolean isToday(String dataPedido) {
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        String formattedToday = today.format(formatter);
        return dataPedido.equals(formattedToday);
    }


    /*
    private PedidoCozinhaDTO filterAndConvertToPedidoCozinhaDTO(Pedidos pedido) {
        List<PedidoCozinhaProdutosDTO> produtosCozinhaDTO = pedido.getProdutos().stream()
                .filter(produtosPedido -> produtosPedido.getProduto().getCategoriaProd().getValue().equalsIgnoreCase("cozinha"))
                .map(produtosPedido -> new PedidoCozinhaProdutosDTO(
                        produtosPedido.getProduto().getIdProd(),
                        produtosPedido.getProduto().getNomeProd(),
                        produtosPedido.getQuantidade()
                ))
                .collect(Collectors.toList());

        Integer numeroMesa = pedido.getMesa() != null ? pedido.getMesa().getNumeroMesa() : null;

        return new PedidoCozinhaDTO(
                pedido.getIdPedido(),
                pedido.getHoraPedido(),
                pedido.getHoraPronto(),
                pedido.isPedidoProntoCozinha(),
                produtosCozinhaDTO,
                numeroMesa
        );
    }

     */


    /*
    @Transactional
    public List<PedidoCozinhaDTO> getPedidoForBalcaoPreparo(String token) {
        try
        {
            Empresas empresa = authenticationService.getEmpresaByToken(token);
            if (empresa != null)
            {
                List<Pedidos> pedidos = repository.findByEmpresa(empresa);
                return pedidos.stream()
                .filter(pedido -> isToday(pedido.getDataPedido())
                )
                .map(this::filterAndConvertToPedidoCozinhaDTOBalcao)
                .filter(dto -> !dto.produtos().isEmpty()
                )
                .collect(Collectors.toList());
            }
            else{
                throw new PedidoException("Falha ao buscar os pedidos do balcão.");
            }
        }
        catch(Exception e)
        {
           throw new PedidoException("Falha ao tentar buscar os pedidos do balcão.");
        }
    }

     */
    /*
    private PedidoCozinhaDTO filterAndConvertToPedidoCozinhaDTOBalcao(Pedidos pedido) {
        List<PedidoCozinhaProdutosDTO> produtosCozinhaDTO = pedido.getProdutos().stream()
                .filter(produtosPedido -> !produtosPedido.getProduto().getCategoriaProd().getValue().equalsIgnoreCase("cozinha"))
                .map(produtosPedido -> new PedidoCozinhaProdutosDTO(
                        produtosPedido.getProduto().getIdProd(),
                        produtosPedido.getProduto().getNomeProd(),
                        produtosPedido.getQuantidade()
                ))
                .collect(Collectors.toList());

        Integer numeroMesa = pedido.getMesa() != null ? pedido.getMesa().getNumeroMesa() : null;

        return new PedidoCozinhaDTO(
                pedido.getIdPedido(),
                pedido.getHoraPedido(),
                pedido.getHoraPronto(),
                pedido.isPedidoProntoBalcao(),
                produtosCozinhaDTO,
                numeroMesa
        );
    }

     */

    public List<Pedidos> getAllByMesa(Mesa mesa, String token) {
        Empresas empresa = authenticationService.getEmpresaByToken(token);
        if (empresa != null)
        {
            return repository.findByMesaAndEmpresa(mesa, empresa);
        }
        else{
            throw new PedidoException("Falha ao autenticar.");
        }
    }

    @Transactional
    public List<PedidosProntoGarcomDTO> pedidoProntoGarcom(String token) {
        try
        {
            Empresas empresa = authenticationService.getEmpresaByToken(token);
            if (empresa != null)
            {
                return repository.findByEmpresa(empresa).stream()
                        .filter(pedido -> isToday(pedido.getDataPedido()) && pedido.isPedidoPronto())
                        .map(this::convertPedidoIntoPedidosProntoGarcomDTO)
                        .toList();
            }
            else{
                throw new PedidoException("Falha ao tentar buscar os pedidos do garçom");
            }
        }
        catch (Exception e)
        {
            throw new PedidoException("Falha ao tentar buscar os pedidos prontos do garçom");
        }
    }

    @Transactional
    private PedidosProntoGarcomDTO convertPedidoIntoPedidosProntoGarcomDTO(Pedidos pedido) {
        List<ProdutoQuantidadeDTO> produtoDTOs = pedido.getProdutos().stream()
                .map(produtoPedido -> new ProdutoQuantidadeDTO(
                        produtoPedido.getProduto().getIdProd(),
                        produtoPedido.getProduto().getNomeProd(),
                        produtoPedido.getQuantidade()
                ))
                .toList();

        int numeroMesa = pedido.getMesa().getNumeroMesa();

        return new PedidosProntoGarcomDTO(pedido.getIdPedido(), produtoDTOs, numeroMesa);
    }

    public void setPedidoPago(Pedidos pedido) {
        try
        {
            pedido.setPedidoPago(true);
            repository.saveAndFlush(pedido);
        }
        catch (Exception e)
        {
            throw new PedidoException("Falha ao tentar alterar o estado do pedido.");
        }
    }

    public Pedidos getPedidoByEmpresaAndId(String idPedido, Empresas empresa, String token) {
        try
        {
            return repository.findByIdPedidoAndEmpresa(idPedido, empresa);
        }
        catch (Exception e)
        {
            throw new PedidoException("Falha ao tentar buscar o pedido");
        }
    }
}
