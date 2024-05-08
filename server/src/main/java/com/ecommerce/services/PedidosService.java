package com.ecommerce.services;

import com.ecommerce.entities.Mesa;
import com.ecommerce.entities.Pedidos;
import com.ecommerce.entities.Products;
import com.ecommerce.entities.Users;
import com.ecommerce.repository.MesaRepository;
import com.ecommerce.repository.PedidosRepository;
import com.ecommerce.repository.ProductsRepository;
import com.ecommerce.repository.UsersRepository;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

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

    public List<Pedidos> getAllPedidos()
    {
        return repository.findAll();
    }

    public Pedidos getPedidoById(String id)
    {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido nao encontrado."));
    }

    public ResponseEntity<String> addPedidoDelivery(List<Products> products, String tokenUser)
    {
        List<Products> produtos = new ArrayList<>();
        products.forEach((prod) -> {
            produtos.add(productsRepository.findById(prod.getIdProd())
                    .orElseThrow(() -> new RuntimeException("Produto nao encontrado no sistema\nFalha para criar pedido")));
        });

        UserDetails user = usersRepository.findByLoginUser(authenticationService.getUserName(tokenUser));
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
            pedido.setDataPedido(dataAtual);

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
            pedido.setDataPedido(dataAtual);

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

    public ResponseEntity<String> setPedidoPronto(String idPedido)
    {
        try
        {
            Pedidos pedido = repository.findById(idPedido)
                    .orElseThrow(() -> new RuntimeException("Pedido nao encontrado no sistema.\nFalha para alterar para pedido pronto."));

            pedido.setPedidoPronto(true);
            repository.saveAndFlush(pedido);
            return ResponseEntity.ok("Pedido foi alterado para pronto.");
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
}
