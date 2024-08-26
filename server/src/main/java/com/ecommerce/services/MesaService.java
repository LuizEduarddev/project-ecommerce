package com.ecommerce.services;

import com.ecommerce.entities.Mesa;
import com.ecommerce.entities.Pedidos;
import com.ecommerce.entities.Users;
import com.ecommerce.entities.dto.MesaBalcaoDTO;
import com.ecommerce.entities.dto.MesaDTO;
import com.ecommerce.entities.dto.PedidosMesaDTO;
import com.ecommerce.repository.MesaRepository;
import com.ecommerce.repository.UsersRepository;
import jakarta.transaction.Transactional;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MesaService {

    @Autowired
    private MesaRepository repository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    @Lazy
    private PedidosService pedidosService;

    public List<MesaBalcaoDTO> getAllMesa(String token)
    {
        //PERMISSAO FUNCTIONANDO
        /*
        Collection<? extends GrantedAuthority> permission = authenticationService.getPermission(token);
        for (GrantedAuthority permissao : permission) {
            if (permissao.equals("USER_CAFE")) {
                return repository.findAll();
            }
        }
        throw new RuntimeException("Necessária uma permissão maior.");
        return repository.findAll();Starting pgAdmin 4...
         */
        List<MesaBalcaoDTO> mesaDTO = new ArrayList<>();
        List<Mesa> mesaList = repository.findAll();

        mesaList.forEach(mesa -> {
            MesaBalcaoDTO dto = new MesaBalcaoDTO(
                    mesa.getIdMesa(),
                    mesa.getNumeroMesa(),
                    mesa.isEmUso(),
                    mesa.isMesaSuja()
            );
            mesaDTO.add(dto);
        });
        return mesaDTO;

    }

    public ResponseEntity<String> addMesa(int numeroMesa, String token)
    {
            try
            {
                Mesa mesa = new Mesa();
                mesa.setNumeroMesa(numeroMesa);
                mesa.setEmUso(false);
                mesa.setMesaSuja(false);
                repository.saveAndFlush(mesa);
                return ResponseEntity.ok("Mesa criada com sucesso.");
            }
            catch (Exception e)
            {
                return ResponseEntity.badRequest().body("Um problema ocorreu ao tentar criar a mesa.\nError: " + e);
            }
        //VERIFICAÇÃO DE AUTORIDADE NO SISTEMA PRONTA
        /*
        try
        {
            if (authenticationService.getUser(token).getAuthorities().contains("USER_ADMIN"))
            {
                mesa.setEmUso(false);
                mesa.setMesaSuja(false);
                repository.saveAndFlush(mesa);
                return ResponseEntity.ok("Mesa criada com sucesso.");
            }
            else{
                return ResponseEntity.ok("É necessário uma hierárquia maior.");
            }
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body("Um problema ocorreu ao tentar criar a mesa.\nError: " + e);
        }

         */
    }

    @Transactional
    public ResponseEntity<String> addClienteMesa(String idMesa, String token)
    {
        try {
            Mesa mesa = repository.findById(idMesa)
                    .orElseThrow(() -> new RuntimeException("Mesa nao encontrada."));

            Users user = usersRepository.findByLoginUser(authenticationService.getUserName(token));

            Optional<Mesa> isInMesa = repository.findMesaByUsers(user);

            if (isInMesa.isEmpty()) {
                if (!mesa.isEmUso()) {
                    mesa.setEmUso(true);
                }

                if (mesa.getIdUsers().isEmpty()) {
                    List<Users> usersList = new ArrayList<>();
                    usersList.add(user);
                    mesa.setIdUsers(usersList);
                    repository.saveAndFlush(mesa);
                    return ResponseEntity.ok("Cadastrado com sucesso.");
                } else {
                    List<Users> usersList = mesa.getIdUsers();
                    usersList.add(user);
                    mesa.setIdUsers(usersList);
                    repository.saveAndFlush(mesa);
                    return ResponseEntity.ok("Cadastrado com sucesso.");
                }
            }
            else{
                return ResponseEntity.ok("Cliente já está em uma mesa");
            }
        }
        catch(Exception e)
        {
            throw new RuntimeException("Falha ao tentar criar a mesa.\n" + e);
        }
    }

    public Mesa getMesaFullById(String idMesa)
    {
       return repository.findById(idMesa).orElseThrow();
    }

    public ResponseEntity<String> deleteUser(String idMesa, String token)
    {
        try
        {
            Mesa mesa = repository.findById(idMesa)
                    .orElseThrow(() -> new RuntimeException("Mesa nao encontrada"));

            Users user = authenticationService.getUser(token);
            if (user != null)
            {
                List<Users> userList = mesa.getIdUsers();

                if (userList.contains(user))
                {
                    if (!pedidosService.pedidoPendente(idMesa, token))
                    {
                        userList.remove(user);
                        mesa.setIdUsers(userList);
                        repository.saveAndFlush(mesa);
                        return ResponseEntity.ok("Saída de mesa executada com sucesso");
                    }
                    else{
                        throw new RuntimeException("Pagamento pendente");
                    }
                }
                else
                {
                    throw new RuntimeException("Usuario nao presente na mesa");
                }
            }
            else{
                return ResponseEntity.ofNullable("Usuario não encontrado.");
            }
        }
        catch(Exception e)
        {
            return ResponseEntity.badRequest().body("Um erro ocorreu ao tentar retirar o usuario da mesa.\nError: " + e);
        }

    }

    public ResponseEntity<String> deleteAllUser(String idMesa)
    {
        try
        {
            Mesa mesa = repository.findById(idMesa)
                    .orElseThrow(() -> new RuntimeException("Mesa nao encontrada em 'addClienteMesa'"));

            List<Users> userList = new ArrayList<>();

            mesa.setIdUsers(userList);
            mesa.setMesaSuja(true);
            repository.saveAndFlush(mesa);

            return ResponseEntity.ok("Mesa finalizada com sucesso.");
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body("Um erro ocorreu ao tentar finalizar a mesa.\nError: " + e);
        }
    }

    /*
    public MesaDTO getMesaById(String token, String idMesa) {
        //AUTENTICACAO FUNCIONANDO
        /*
        try
        {
            Users user = authenticationService.getUser(token);
            Optional<Mesa> mesa = repository.findById(idMesa);
            if (mesa.isPresent())
            {
                List<String> nomeClientes = new ArrayList<>();
                mesa.get().getIdUsers().forEach(usuario -> nomeClientes.add(usuario.getUsername()));
                return new MesaDTO(mesa.get().getNumeroMesa(), nomeClientes, pedidosService.getPedidoByMesa(mesa.get()));
            }
            else{
                throw new RuntimeException("Mesa não encontrada");
            }
        }
        catch(Exception e)
        {
            throw new RuntimeException("Ocorreu um erro ao tentar buscar a mesa.\n" + e);
        }
         */
        /*
        try {
            Optional<Mesa> mesa = repository.findById(idMesa);
            return mesa.map(mesaPresent -> {
                List<Pedidos> pedidos = pedidosService.getPedidoByMesa(mesaPresent);

                List<PedidosMesaDTO> pedidosMesaDTOs = pedidos.stream()
                        .flatMap(pedido -> pedido.getProdutos().stream()
                                .map(produto -> new PedidosMesaDTO(
                                        produto.getIdProd(),
                                        produto.getPrecoProd(),
                                        produto.getNomeProd())))
                        .collect(Collectors.toList());

                double valorTotal = pedidosMesaDTOs.stream()
                        .mapToDouble(PedidosMesaDTO::valorProduto)
                        .sum();

                return new MesaDTO(mesaPresent.getNumeroMesa(), pedidosMesaDTOs, valorTotal);
            }).orElse(null);
        } catch (Exception e) {
            throw new RuntimeException("Ocorreu um erro ao tentar buscar a mesa.\n" + e);
        }
        */

}
