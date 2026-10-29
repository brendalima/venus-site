import { Link } from "react-router-dom";
import "./Secoes.css";

/**
 * As três seções de texto da home, abaixo da coleção.
 *
 * Existem porque o menu do cabeçalho aponta para elas. Vieram do
 * protótipo da home, com os textos ajustados numa coisa: **o site não
 * vende.** O protótipo prometia pagamento, frete e troca em 7 dias, que
 * são compromissos que um catálogo não tem como honrar — publicados aqui,
 * valeriam como promessa sem ninguém do outro lado para cumprir. O que o
 * site faz é dizer que quem fecha é a conversa no WhatsApp.
 *
 * Sem foto nenhuma: o repositório não guarda foto de produto, e as do
 * protótipo eram justamente fotos de peça. O lookbook do protótipo tinha
 * duas; aqui ele é só texto, e a coleção acima já é a parte visual da
 * home.
 */

export function Lookbook() {
  return (
    <section className="secao secao--realce" id="lookbook" aria-labelledby="lookbook-titulo">
      <div className="page secao__inner">
        <h2 className="secao__titulo" id="lookbook-titulo">
          Luz, pele e cor.
        </h2>

        <div className="secao__prosa">
          <p>
            A Vênus Oasis nasce do encontro entre o brilho dourado do fim de
            tarde e o azul turquesa do mar. Cada peça é pensada para quem
            gosta de ser notada sem precisar pedir licença.
          </p>
          <p>
            Modelagem confortável, acabamento limpo e cores que conversam com
            todos os tons de pele. Produção em pequenos lotes, no Brasil: cada
            cor volta poucas vezes.
          </p>
        </div>

        <Link className="secao__botao" to="/#colecao">
          Escolher meu conjunto
        </Link>
      </div>
    </section>
  );
}

export function ComoComprar() {
  return (
    <section className="secao" id="comprar" aria-labelledby="comprar-titulo">
      <div className="page secao__inner">
        <h2 className="secao__titulo" id="comprar-titulo">
          Comprar é simples
        </h2>

        <p className="secao__linha">
          Atendimento direto, sem carrinho e sem surpresa no tamanho.
        </p>

        {/* Lista ordenada de verdade: são três passos em ordem, e quem usa
            leitor de tela ouve "1 de 3". O numeral grande é desenhado pelo
            CSS a partir do contador, não escrito no texto. */}
        <ol className="passos">
          <li>
            <h3>Escolha a peça</h3>
            <p>
              Abra a peça que você gostou e veja as cores, as fotos e a grade
              de tamanhos.
            </p>
          </li>
          <li>
            <h3>Confirme tamanho e cor</h3>
            <p>
              Mande uma mensagem no WhatsApp. A gente passa as medidas da
              modelagem e confirma na hora o que tem em estoque.
            </p>
          </li>
          <li>
            <h3>Combine o resto na conversa</h3>
            <p>
              Pagamento e envio são acertados por lá. Este site é catálogo:
              serve para você escolher, não para fechar.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}

export function Duvidas() {
  return (
    <section className="secao" id="duvidas" aria-labelledby="duvidas-titulo">
      <div className="page secao__inner secao__inner--duvidas">
        <h2 className="secao__titulo" id="duvidas-titulo">
          Dúvidas frequentes
        </h2>

        <div className="duvidas">
          <details className="acordeao">
            <summary>Como escolho meu tamanho?</summary>
            <p>
              Mande sua altura, peso e medida de quadril no WhatsApp. A gente
              indica o tamanho certo para cada modelagem — o mesmo P não cai
              igual num tomara-que-caia e num cortininha.
            </p>
          </details>

          <details className="acordeao">
            <summary>O tecido desbota com sol e cloro?</summary>
            <p>
              Para durar mais, lave à mão com sabão neutro e seque à sombra.
              Cloro e sol forte desbotam a cor de qualquer tecido de praia.
            </p>
          </details>

          <details className="acordeao">
            <summary>Posso trocar se não servir?</summary>
            <p>
              Por higiene, a troca vale só para peça sem uso e com etiqueta.
              Fale com a gente no WhatsApp assim que receber, que a gente
              combina.
            </p>
          </details>

          <details className="acordeao">
            <summary>Vocês enviam para todo o Brasil?</summary>
            <p>
              Sim. O frete sai pelo CEP e é combinado no WhatsApp antes de
              qualquer pagamento.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
