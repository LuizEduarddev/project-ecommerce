package com.ecommerce.services;

import com.ecommerce.entities.Pagamentos;
import com.ecommerce.entities.Pedidos;
import com.ecommerce.entities.Users;
import com.ecommerce.repository.PagamentosRepository;
import com.ecommerce.repository.PedidosRepository;
import com.ecommerce.repository.UsersRepository;
import com.mercadopago.resources.payment.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PagamentoService {

    @Autowired
    private PagamentosRepository repository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private PedidosRepository pedidosRepository;

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

    public void insertPagamento(Payment response, Users user, String idPedido) {
        try
        {
            int pontos = calculatePontosCupcake(idPedido, user.getIdUser());
            Pagamentos pagamento = new Pagamentos(user, response.getDateApproved(), pontos, response.getStatus(), response.getPaymentMethod());
        }
        catch (Exception e)
        {
            throw new RuntimeException("Falha ao tentar capturar o pagamento.\n" + e);
        }
    }

    private int calculatePontosCupcake(String idPedido, String idUser)
    {
        try
        {
            Users user = usersRepository.findByLoginUser(authenticationService.getUserName(idUser));
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
}
