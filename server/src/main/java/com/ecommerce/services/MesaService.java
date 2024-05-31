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
import java.util.Optional;

@Service
public class MesaService {

    @Autowired
    private MesaRepository repository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private AuthenticationService authenticationService;

    public List<Mesa> getAllMesa()
    {
        return repository.findAll();
    }

    public ResponseEntity<String> addMesa(Mesa mesa)
    {
        try
        {
            mesa.setEmUso(false);
            mesa.setMesaSuja(false);
            repository.saveAndFlush(mesa);
            return ResponseEntity.ok("Mesa criada com sucesso.");
        }
        catch (Exception e)
        {
            return ResponseEntity.badRequest().body("Um problema ocorreu ao tentar criar a mesa.\nError: " + e);
        }
    }

    public Optional<Integer> addClienteMesa(String idMesa, String token)
    {
        try
        {
            Mesa mesa = repository.findById(idMesa)
                    .orElseThrow(() -> new RuntimeException("Mesa nao encontrada em 'addClienteMesa'"));

            Users user = usersRepository.findByLoginUser(authenticationService.getUserName(token));

            Optional<Mesa> isInMesa = repository.findMesaByUsers(user);

            if (isInMesa.isPresent())
            {
                return Optional.empty();
            }
            else{
                if (!mesa.isEmUso())
                {
                    mesa.setEmUso(true);
                }

                if (mesa.getIdUsers().isEmpty()) {
                    List<Users> usersList = new ArrayList<>();
                    usersList.add(user);
                    mesa.setIdUsers(usersList);
                    repository.saveAndFlush(mesa);
                }
                else{
                    List<Users> usersList = mesa.getIdUsers();
                    usersList.add(user);
                    mesa.setIdUsers(usersList);
                    repository.saveAndFlush(mesa);
                }

                return Optional.of(mesa.getNumeroMesa());
            }
        }
        catch(Exception e)
        {
            return Optional.empty();
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

    public Optional<Mesa> getMesaById(String token) {
        Users user = usersRepository.findByLoginUser(authenticationService.getUserName(token));
        return repository.findMesaByUsers(user);
    }
}
