document.addEventListener("DOMContentLoaded", () => {
  let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

  function salvarProdutos() {
    localStorage.setItem("produtos", JSON.stringify(produtos));
  }

  // --- LÓGICA DA PÁGINA DE CADASTRO E EDIÇÃO ---
  const form = document.getElementById("produtoForm");
  if (form) {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id');

    if (produtoId) {
      const produtoParaEditar = produtos.find(p => p.id == produtoId);
      if (produtoParaEditar) {
        document.getElementById("nome").value = produtoParaEditar.nome;
        document.getElementById("preco").value = produtoParaEditar.preco;
        document.getElementById("categoria").value = produtoParaEditar.categoria;
        document.getElementById("origem").value = produtoParaEditar.origem;
        document.getElementById("lote").value = produtoParaEditar.lote;
        document.getElementById("validade").value = produtoParaEditar.validade;
        
        document.getElementById("header-title").textContent = "✏️ Editar Produto";
        document.getElementById("form-title").textContent = "Alterar Produto";
        document.getElementById("form-button").textContent = "Salvar Alterações";
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (produtoId) {
        const index = produtos.findIndex(p => p.id == produtoId);
        if (index !== -1) {
          produtos[index] = {
            id: produtos[index].id, // Mantém o ID original
            nome: document.getElementById("nome").value,
            preco: parseFloat(document.getElementById("preco").value),
            categoria: document.getElementById("categoria").value,
            origem: document.getElementById("origem").value,
            lote: document.getElementById("lote").value,
            validade: document.getElementById("validade").value,
          };
          alert("Produto atualizado com sucesso!");
        }
      } else {
        const novoProduto = {
          id: Date.now(),
          nome: document.getElementById("nome").value,
          preco: parseFloat(document.getElementById("preco").value),
          categoria: document.getElementById("categoria").value,
          origem: document.getElementById("origem").value,
          lote: document.getElementById("lote").value,
          validade: document.getElementById("validade").value,
        };
        produtos.push(novoProduto);
        alert("Produto cadastrado com sucesso!");
      }
      
      salvarProdutos();
      window.location.href = "lista.html";
    });
  }

  // --- LÓGICA DA PÁGINA DE LISTAGEM ---
  const tabelaBody = document.getElementById("listaProdutos");
  const msgVazio = document.getElementById("msgVazio");

  function renderizarTabela() {
    if (!tabelaBody) return;
    tabelaBody.innerHTML = "";

    if (produtos.length === 0) {
      if (msgVazio) msgVazio.style.display = "block";
      document.getElementById("tabelaProdutos").style.display = "none";
    } else {
      if (msgVazio) msgVazio.style.display = "none";
      document.getElementById("tabelaProdutos").style.display = "";

      produtos.forEach(p => {
        const row = tabelaBody.insertRow();

        row.insertCell().textContent = p.nome;
        
        // Garante que o preço seja um número antes de formatar
        const preco = typeof p.preco === 'number' ? p.preco : 0;
        row.insertCell().textContent = `R$ ${preco.toFixed(2).replace('.', ',')}`;

        row.insertCell().textContent = p.categoria;
        row.insertCell().textContent = p.origem;
        row.insertCell().textContent = p.lote;

        // Formatação da Data para DD/MM/AAAA (com segurança)
        if (p.validade) {
          const [ano, mes, dia] = p.validade.split('-');
          row.insertCell().textContent = `${dia}/${mes}/${ano}`;
        } else {
          row.insertCell().textContent = 'N/A';
        }

        const acoesCell = row.insertCell();
        acoesCell.classList.add("acoes-cell");

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.className = "btn-acao btn-editar";
        btnEditar.onclick = () => editarProduto(p.id);

        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.className = "btn-acao btn-excluir";
        btnExcluir.onclick = () => excluirProduto(p.id);

        acoesCell.appendChild(btnEditar);
        acoesCell.appendChild(btnExcluir);
      });
    }
  }

  function editarProduto(id) {
    window.location.href = `cadastro.html?id=${id}`;
  }

  function excluirProduto(id) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      produtos = produtos.filter(p => p.id !== id);
      salvarProdutos();
      renderizarTabela();
    }
  }

  renderizarTabela();
});