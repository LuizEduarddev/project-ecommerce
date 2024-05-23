package com.ecommerce.services;

import com.ecommerce.entities.*;
import com.ecommerce.entities.dto.ProductsDTO;
import com.ecommerce.repository.MesaRepository;
import com.ecommerce.repository.PedidosRepository;
import com.ecommerce.repository.ProductsRepository;
import com.ecommerce.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.text.SimpleDateFormat;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

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

        if (hasCozinha|| hasAdmin)
        {
            return repository.findAll();
        }
        else {
            throw new RuntimeException("Requerido uma permissão maior.");
        }

    }

    public Pedidos getPedidoById(String id, String token)
    {
        if (checkUserAuthority(token) == HttpStatus.ACCEPTED) return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido nao encontrado."));
        else{
            throw new RuntimeException("É necessária uma permissao maior para esta acao.");
        }
    }

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

    private HttpStatus checkUserAuthority(String token)
    {
        Users user = usersRepository.findByLoginUser(authenticationService.getUserName(token));
        if (user != null)
        {
            boolean hasCozinha = user.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_COZINHA-CAFE"));
            if (hasCozinha) return HttpStatus.ACCEPTED;
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
            repository.saveAndFlush(pedido);
            return ResponseEntity.ok("Pedido foi alterado para pronto.");
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body("Falha ao tentar mudar o status do pedido para pronto.\nError: "  + e);
        }
    }

    public List<Pedidos> getPedidoByUser(String token) {
        Users user = usersRepository.findByLoginUser(authenticationService.getUserName(token));
        if (user == null)
        {
            throw new RuntimeException("Não foi possível localizar o usuário");
        }
        else{
            List<Pedidos> pedidos = repository.findByUsers(user);
            return pedidos;
        }
    }
}
