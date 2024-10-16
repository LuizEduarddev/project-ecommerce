package com.ecommerce.services;

import com.ecommerce.entities.dto.CriaEmpresaDTO;
import com.ecommerce.entities.Empresas;
import com.ecommerce.entities.errors.EmpresasException;
import com.ecommerce.repository.EmpresasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
public class EmpresasService {

    @Autowired
    private EmpresasRepository repository;

    public List<Empresas> getAllEmpresas()
    {
        try{
            return repository.findAll();
        }
        catch(Exception e)
        {
          throw new EmpresasException("Falha ao tentar buscar as empresas");
        }
    }

    public Empresas getEmpresaById(String id)
    {
        return repository.findById(id)
                .orElseThrow(() -> new EmpresasException("Erro ao tentar buscar a empresa"));
    }

    public ResponseEntity addEmpresa(CriaEmpresaDTO empresaDTO)
    {
        if (empresaDTO.cidade().isEmpty())
        {
            throw new EmpresasException("Cidade não pode ser nula");
        }
        else if (empresaDTO.cnpj().isEmpty())
        {
            throw new EmpresasException("CNPJ não pode ser nulo");
        }
        else if (empresaDTO.nomeFantasia().isEmpty())
        {
            throw new EmpresasException("Nome fantasia não pode ser nulo");
        }
        else{
            try
            {
                Empresas empresa = new Empresas();
                Date dataAtual = new Date();
                SimpleDateFormat formatDate = new SimpleDateFormat("dd-MM-yyyy");
                String dataFormatada = formatDate.format(dataAtual);
                empresa.setDataCadastro(dataFormatada);
                empresa.setCidadeEmpresa(empresaDTO.cidade());
                empresa.setNomeFantasia(empresaDTO.nomeFantasia());
                empresa.setCnpjEmpresa(empresaDTO.cnpj());

                repository.saveAndFlush(empresa);
                return ResponseEntity.ok(HttpStatus.ACCEPTED);
            }
            catch(Exception e)
            {
               throw new EmpresasException("Falha ao tentar cadastrar a empresa.");
            }
        }
    }

    /*
    public ResponseEntity deletarEmpresa(String idEmpresa)
    {
        try
        {
            Empresas empresa = repository.findById(idEmpresa)
                    .orElse(() -> {
                        return ResponseEntity.ofNullable("Empresa não encontrada")
                    });
        }
        catch (Exception e)
        {

        }
    }
     */

}
