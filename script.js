const apiKey = "5517416c010a2e875325b84c352f0a2a";

//Autorizações

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NTE3NDE2YzAxMGEyZTg3NTMyNWI4NGMzNTJmMGEyYSIsInN1YiI6IjYzZTU5YjExZDI5YmRkMDA3Y2E3MTMyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UGmNv0nnPeJySzranxfXm7CESDpf4QT-H_nOnIBLBI4"
  }
};

const container = document.querySelector(".container");

let page = 1;

//Link da Api

fetch(
  `https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=${page}`,
  options
)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    data.results.forEach((movie) => {
      var imagem = "https://image.tmdb.org/t/p/w500" + movie.poster_path;

      criarCard(
        imagem,
        movie.title,
        movie.vote_average,
        movie.overview,
        container
      );
    });
  })
  .catch((err) => console.error(err));

//Função que cria card automaticamente

function criarCard(img, titulo, nota, detalhes, divPai) {
  const filmeCard = document.createElement("div");
  filmeCard.classList.add("filme");

  const capaFilme = document.createElement("img");
  capaFilme.src = img;
  filmeCard.appendChild(capaFilme);

  const tituloFilme = document.createElement("h1");
  tituloFilme.textContent = titulo;
  filmeCard.appendChild(tituloFilme);

  const notaFilme = document.createElement("p");
  notaFilme.textContent = "Nota: " + nota.toFixed(1);
  filmeCard.appendChild(notaFilme);

  //Mostrar detalhes:
  const detalhesCard = document.querySelector(".detalhes");

  filmeCard.addEventListener("click", function () {
    detalhesCard.style.animation = "2s showDetails forwards";

    const detalhesTitulo = document.querySelector("#detalhesTitulo");
    detalhesTitulo.textContent = titulo;

    const detalhesDescricao = document.querySelector("#detalhesDescricao");
    detalhesDescricao.textContent = detalhes;
  });

  //FecharDetalhes:

  const fecharDetalhes = document.querySelector("#fecharDetalhes");

  fecharDetalhes.addEventListener("click", function () {
    detalhesCard.style.animation = "2s desaparecerDetails forwards";
  });

  divPai.appendChild(filmeCard);
}

//Avançar páginas

const btnAvancar = document.querySelector("#avancar");
const btnBack = document.querySelector("#voltar");

btnAvancar.addEventListener("click", function () {
  //Voltam para o inicio da pagina
  document.documentElement.scrollTop = 0; // Para navegadores modernos
  document.body.scrollTop = 0; //Para navegadores mais antigos

  // Atualize a página para a próxima página
  page = page + 1;

  // Faça uma nova solicitação à API com a página atualizada
  fetch(
    `https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=${page}`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      // Remova os cartões existentes da página atual
      container.innerHTML = "";

      // Crie novos cartões com os dados da nova página
      data.results.forEach((movie) => {
        var imagem = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
        criarCard(
          imagem,
          movie.title,
          movie.vote_average,
          movie.overview,
          container
        );
      });
    })
    .catch((err) => console.error(err));

  //Mostra o botão de voltar

  if (page > 1) {
    btnBack.style.display = "inline";
  }
});

//Voltar para a página anterior

btnBack.addEventListener("click", function () {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  page = page + -1;

  fetch(
    `https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=${page}`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      container.innerHTML = "";

      data.results.forEach((movie) => {
        var imagem = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
        criarCard(
          imagem,
          movie.title,
          movie.vote_average,
          movie.overview,
          container
        );
      });
    })
    .catch((err) => console.error(err));

  if (page == 1) {
    btnBack.style.display = "none";
  }
});

//Barra Pesquisa

const barraPesquisa = document.getElementById("barraPesquisa");
const btnPesquisa = document.getElementById("btnPesquisa");
const mensageError = document.getElementById("errorMensage");

//Função que realiza a pesquisa
function pesquisar() {
  const pesquisa = barraPesquisa.value; // Obtenha o valor da barra de pesquisa

  if (pesquisa != "") {
    container.innerHTML = "";

    fetch(
      `https://api.themoviedb.org/3/search/movie?query=${pesquisa}&api_key=${apiKey}&language=pt-BR`, // Use a variável 'pesquisa' em vez de 'barraPesquisa'
      options
    )
      .then((response) => response.json())
      .then((data) => {
        mensageError.style.display = "none";
        data.results.forEach((movie) => {
          const imagem = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
          criarCard(
            imagem,
            movie.title,
            movie.vote_average,
            movie.overview,
            container
          );
        });

        //Caso não retorne resultados
        if (data.results == "") {
          mensageError.style.display = "block";
        }
      })
      .catch((err) => console.error(err));

    btnAvancar.style.display = "none";
    btnBack.style.display = "none";
  }
}

//Pesquisa através do botão
btnPesquisa.addEventListener("click", pesquisar);

//Pesquisa através da tecla Enter
barraPesquisa.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    pesquisar();
  }
});

//Voltar para a primeira página:

const btnVoltar = document.getElementById("btnVoltar");

btnVoltar.addEventListener("click", function () {
  //Resets
  barraPesquisa.value = "";
  mensageError.style.display = "none";

  page = 1;

  fetch(
    `https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=${page}`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      container.innerHTML = "";

      data.results.forEach((movie) => {
        var imagem = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
        criarCard(
          imagem,
          movie.title,
          movie.vote_average,
          movie.overview,
          container
        );
      });
    })
    .catch((err) => console.error(err));

  btnBack.style.display = "none";
  btnAvancar.style.display = "inline";
});
