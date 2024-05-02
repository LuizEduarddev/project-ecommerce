package com.ecommerce.services;

import com.ecommerce.entities.Mesa;
import com.ecommerce.entities.Users;
import com.ecommerce.repository.MesaRepository;
import com.ecommerce.repository.UsersRepository;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MesaService {

    @Autowired
    private MesaRepository repository;

    @Autowired
    private UsersRepository usersRepository;

    public List<Mesa> getAllMesa()
    {
        return repository.findAll();
    }

    public ResponseEntity<String> addMesa(Mesa mesa)
    {
        try
        {
            List<Users> users = new ArrayList<>();
            mesa.setIdUsers(users);
            repository.saveAndFlush(mesa);
            return ResponseEntity.ok("Mesa criada com sucesso.");
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body("Um problema ocorreu ao tentar criar a mesa.\nError: " + e);
        }
    }

    public ResponseEntity<String> addClienteMesa(String idMesa, String idCliente)
    {
        try
        {
            Mesa mesa = repository.findById(idMesa)
                    .orElseThrow(() -> new RuntimeException("Mesa nao encontrada em 'addClienteMesa'"));

            Users user = usersRepository.findById(idCliente)
                    .orElseThrow(() -> new RuntimeException("Cliente nao encontrado em 'addClienteMesa'"));

            if (!mesa.getIdUsers().isEmpty())
            {
                mesa.setEmUso(true);
            }

            List<Users> usersList = mesa.getIdUsers();
            usersList.add(user);

            mesa.setIdUsers(usersList);
            repository.saveAndFlush(mesa);

            return ResponseEntity.ok("Bem-vindo a mesa '" + mesa.getNumeroMesa() + "', " + user.getUsername());

        }
        catch(Exception e)
        {
            return ResponseEntity.badRequest().body("Falha ao tentar cadastrar o usuario na mesa.");
        }
    }

    public ResponseEntity<String> deleteUser(String idMesa, String idCliente)
    {
        try
        {
            Mesa mesa = repository.findById(idMesa)
                    .orElseThrow(() -> new RuntimeException("Mesa nao encontrada em 'addClienteMesa'"));

            Users user = usersRepository.findById(idCliente)
                    .orElseThrow(() -> new RuntimeException("Cliente nao encontrado em 'addClienteMesa'"));

            List<Users> userList = mesa.getIdUsers();

            if (userList.contains(user))
            {
                userList.remove(user);
                mesa.setIdUsers(userList);
                repository.saveAndFlush(mesa);
                return ResponseEntity.ok("Ate breve, " + user.getUsername());
            }
            else
            {
                return ResponseEntity.badRequest().body("Usuario '" + user.getUsername() + "' nao encontrado na mesa " + mesa.getNumeroMesa());
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
}
