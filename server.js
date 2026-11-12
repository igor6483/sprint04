import express from "express"
const app = express()
const PORT = 3000
import {lerMensagens, salvarMensagens} from "./store.js"


app.get("/", (req, res) => {
    res.send("Servidor rodando!🚀");
});
app.get("/status",(req,res)=>{
    res.json({status:"online",sprint:4})
})
app.get("/sobre",(req,res)=>{
    res.send("mensageiro local com node.js,express e ES modules")
})

app.get("/mensagens",async (req,res)=>{
    try { res.json(await lerMensagens())}
    catch(erro){
        console.error(erro)
        res.status(500).json({erro: "Não foi possivel ler as mensagens"})
    }
})

app.get("/mensagens/:id", async (req, res) => {
  try {
    const lista = await lerMensagens();
    const mensagem = lista.find(m => m.id === Number(req.params.id));
    if (!mensagem) return res.status(404).json({ erro: "Mensagem não encontrada." });
    res.json(mensagem);
  } catch (erro) {
    console.error(erro)
    res.status(500).json({erro: "Falha ao consultar mensagens"})}
})

  app.get("/mensagens/:id", async (req, res) => {
  try {
    const lista = await lerMensagens();
    const mensagem = lista.find(m => m.id === Number(req.params.id));
    if (!mensagem) return res.status(404).json({ erro: "Mensagem não encontrada." });
    res.json(mensagem);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Falha ao consultar mensagem." });
  }
});

app.get("/total-mensagens",async(req,res)=>{
    try{res.json({total:(await lerMensagens()).length}) }
    catch(erro){
        {res.status(500).json({erro: "Falha na contagem"})}
    }

})


app.get("/exemplo-salvar",async(req,res)=>{
    try{
        const lista = await lerMensagens()
        lista.push({id:Date.now(),usuario:"exemplo",texto:"Gravado no arquivo"})
        await salvarMensagens(lista)
        res.json({ aviso: "Exemplo didatico gravado",total:lista.length})
    }catch(erro){
        console.error(erro)
        res.status(500).json({erro:"Erro ao gravar arquivo"})
    }
})

let filaGravacoes = Promise.resolve()
app.get("/gravar-mensagem-correta", (req, res) => {
  const tarefa = filaGravacoes.then(async () => {
    const lista = await lerMensagens()
    const id = lista.reduce((maior, mensagem) => Math.max(maior, Number(mensagem.id) || 0), 0) + 1
    const mensagem = { id, usuario: "Exemplo", texto: "Gravado em arquivo!" }
    await salvarMensagens([...lista, mensagem])
    return { aviso: "Mensagem gravada com sucesso!", mensagem, total: lista.length + 1 }
  })
  filaGravacoes = tarefa.catch(() => {})
  tarefa.then(resultado => res.json(resultado)).catch(erro => {
    console.error(erro)
    res.status(500).json({ erro: "Erro ao gravar arquivo." })
  })
})

app.listen(PORT,() => {
    console.log(`Servidor em http://localhost:${PORT}`)
})