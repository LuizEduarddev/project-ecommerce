package com.ecommerce.repository;

import com.ecommerce.entities.Empresas;
import com.ecommerce.entities.dto.EmpregadosDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.entities.Users;

import java.util.List;

@Repository
public interface UsersRepository extends JpaRepository<Users, String>{
	 Users findByLoginUser(String login);
	 Users findByUserCpf(String cpf);

    List<Users> findByEmpresa(Empresas empresa);

	@Query("SELECT u FROM users u WHERE (u.userCpf = :query OR u.userFullName LIKE %:query%) AND u.empresa = :empresa")
	List<Users> searchByCpfOrNomeAndEmpresa(@Param("query") String query, @Param("empresa") Empresas empresa);

}
