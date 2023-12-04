const express = require('express');
const cors = require('cors');
const { pool } = require('./config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cors());

const getProdutos = async (request, response) => {
    try{
            //bloco de código a ser executado
            const { rows } = await pool.query(`select p.codigo as codigo, p.nome as nome, p.descricao as descricao, p.quantidade_estoque as quantidade_estoque, p.ativo as ativo, p.valor as valor, to_char(p.data_cadastro,'YYYY-MM-DD') as data_cadastro, p.categoria as categoria, c.nome as categoria_nome
            from produtos p
            join categorias c on p.categoria = c.codigo
            order by p.codigo;`);
            return response.status(200).json(rows);
    } catch (err) {
            //bloco de tratamento de erro caso ele ocorra
            return response.status(400).json({
                status : 'error',
                message : 'Erro ao consultar produtos: ' + err
            })
            
    }
}

const addProduto = async (request, response) => {
    try{
            //bloco de código a ser executado
            const {nome, descricao, quantidade_estoque,
            ativo, valor, data_cadastro, categoria} =  request.body;
            const results = await pool.query(`insert into produtos (nome, descricao, quantidade_estoque, ativo, valor, data_cadastro, categoria)
            values ($1, $2, $3, $4, $5, $6, $7) RETURNING codigo, nome, descricao, quantidade_estoque, ativo, valor, to_char(data_cadastro,'YYYY-MM-DD') as data_cadastro, categoria`, [nome, descricao, quantidade_estoque, ativo, valor, data_cadastro, categoria]);
            const linhainserida = results.rows[0];
            return response.status(200).json({
                status : 'sucess', message : "Produto criado",
                objeto : linhainserida
            })
    } catch (err) {
            //bloco de tratamento de erro caso ele ocorra
            return response.status(400).json({
                status : 'error',
                message : 'Erro ao receber Produto: ' + err
            })
            
    }
}

const updateProduto = async (request, response) => {
    try{
            //bloco de código a ser executado
            const {nome, descricao, quantidade_estoque, ativo, valor, data_cadastro, categoria, codigo} =  request.body;
            const results = await pool.query(`UPDATE produtos SET nome = $1, descricao = $2, quantidade_estoque = $3, ativo = $4, valor = $5, data_cadastro = $6, categoria = $7 
            WHERE codigo = $8
            RETURNING codigo, nome, descricao, quantidade_estoque, ativo, valor, to_char(data_cadastro,'YYYY-MM-DD') as data_cadastro, categoria 
            `, [nome, descricao, quantidade_estoque, ativo, valor, data_cadastro, categoria, codigo]);
            const linhainserida = results.rows[0];
            return response.status(200).json({
                status : 'sucess', message : "Produto atualizado",
                objeto : linhainserida
            })
    } catch (err) {
            //bloco de tratamento de erro caso ele ocorra
            return response.status(400).json({
                status : 'error',
                message : 'Erro ao atualizar categoria: ' + err
            })
            
    }
}

const deleteProduto = async (request, response) => {
    try{
            //bloco de código a ser executado
            const codigo = request.params.codigo;
            const results = await pool.query('DELETE FROM produtos WHERE codigo = $1', [codigo]);
            const linhainserida = results.rows[0];
            if (results.rowCount == 0) {
                return response.status(400).json({
                    status : 'error',
                    message : `Nenhum registro com código ${codigo}`
                })
            }else {
                return response.status(200).json({
                    status : 'sucess',
                    message : 'Sucesso!'
                })
            } 
            
    } catch (err) {
            //bloco de tratamento de erro caso ele ocorra
            return response.status(400).json({
                status : 'error',
                message : 'Erro ao deletar Produto: ' + err
            })
            
    }
}

const getCategorias = async (request, response) => {
    try{
            //bloco de código a ser executado
            const { rows } = await pool.query('SELECT * from categorias order by codigo');
            return response.status(200).json(rows);
    } catch (err) {
            //bloco de tratamento de erro caso ele ocorra
            return response.status(400).json({
                status : 'error',
                message : 'Erro ao consultar categorias: ' + err
            })
            
    }
}

const addCategoria = async (request, response) => {
    try{
            //bloco de código a ser executado
            const {nome} =  request.body;
            const results = await pool.query('INSERT INTO categorias (nome) VALUES ($1) RETURNING codigo, nome', [nome]);
            const linhainserida = results.rows[0];
            return response.status(200).json({
                status : 'sucess', message : "Categoria criada",
                objeto : linhainserida
            })
    } catch (err) {
            //bloco de tratamento de erro caso ele ocorra
            return response.status(400).json({
                status : 'error',
                message : 'Erro ao receber categoria: ' + err
            })
            
    }
}

const updateCategoria = async (request, response) => {
    try{
            //bloco de código a ser executado
            const {codigo, nome} =  request.body;
            const results = await pool.query('UPDATE categorias SET nome = $1 where codigo = $2 RETURNING codigo, nome', [nome, codigo]);
            const linhainserida = results.rows[0];
            return response.status(200).json({
                status : 'sucess', message : "Categoria criada",
                objeto : linhainserida
            })
    } catch (err) {
            //bloco de tratamento de erro caso ele ocorra
            return response.status(400).json({
                status : 'error',
                message : 'Erro ao atualizar categoria: ' + err
            })
            
    }
}

const deleteCategoria = async (request, response) => {
    try{
            //bloco de código a ser executado
            const codigo = request.params.codigo;
            const results = await pool.query('DELETE FROM categorias WHERE codigo = $1', [codigo]);
            const linhainserida = results.rows[0];
            if (results.rowCount == 0) {
                return response.status(400).json({
                    status : 'error',
                    message : `Nenhum registro com código ${codigo}`
                })
            }else {
                return response.status(200).json({
                    status : 'sucess',
                    message : 'Sucesso!'
                })
            } 
            
    } catch (err) {
            //bloco de tratamento de erro caso ele ocorra
            return response.status(400).json({
                status : 'error',
                message : 'Erro ao deletar categoria: ' + err
            })
            
    }
}

//const verCategoria = async (request, response) => {
//    try{
            //bloco de código a ser executado
//            const codigo = request.params.codigo;
//            const results = await pool.query('SELECT * FROM categorias WHERE codigo = $1', [codigo]);
//            const linhainserida = results.rows[0];
//            if (results.rowCount == 0) {
//                return response.status(400).json({
//                    status : 'error',
//                    message : `Nenhum registro com código ${codigo}`
//                })
//            }else {
//                return response.status(200).json({
//                    status : 'sucess',
//                    message : 'Sucesso!'
//                })
//            } 


app.route('/produtos')
    .get(getProdutos)
    .post(addProduto)
    .put(updateProduto)

app.route(`/produtos/:codigo`)
    .delete(deleteProduto)
    

app.route('/categorias')
    .get(getCategorias)
    .post(addCategoria)
    .put(updateCategoria)

app.route(`/categorias/:codigo`)
    .delete(deleteCategoria)
 //   .get(verCategoria)


app.listen(process.env.PORT || 3002, () => {
    console.log('Servidor da API  Rodando');
})