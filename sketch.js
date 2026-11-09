// VARIABILI GLOBALI
  // Variabili necessarie per tutto il codice
  let myTable; // Variabile che conta i dati
  let paeseSelezionato = null //Variabile che memorizza il paese cliccato 
  // null = vuoto, almeno inizialmente

//CONFIGURAZIONE INIZIALE ASINCRONA
// Usiamo "async" perché devo aspettare che il file CSV sia completamente caricato prima di iniziare a disegnare
  async function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  angleMode(DEGREES);
  console.log('p5.js version:', p5.VERSION);

  //LEgge il file appena è caricato
  myTable = await loadTable ("assets/dataset.csv", ",", "header");
  noLoop(); // Blocco il loop continuo per disegnare la schermata una sola volta
  redraw(); // Eseguo il disegno iniziale
}

//CICLO DI DISEGNO PRINCIPALE
  function draw() {
  background('black');  

  // funzione per disegnare glifi
  Glifi();
  // funzione per disegnare legenda e testi
  Legenda();
}

// FUNZIONE PER DISEGNARE I GLIFI
  function Glifi () {
  let totalRows = myTable.getRowCount(); // conta le righe, quidni i paesi del dataset
  
  // IMPOSTAZIONE GRIGLIA:
    let spazio = 105;       // Spazio tra un glifo e l'altro (sia X che Y)
    let yIniziale = 120;   // Posizione Y di partenza
    let xIniziale = 120;   // Posizione X di partenza
    let col = 0;          // contatore colonne
    let riga = 0;         // contatore righe

    // Ciclo per scorrere tutte le righe, quindi i paesi del dataset
    for (let i = 0; i < totalRows; i++) {
    
    // Calcola le coordinate X e Y di ogni glifo
    let x = xIniziale + (col * spazio);
    let y = yIniziale + (riga * spazio);
    let currentScale = 1.2; // Scala di grandezza del glifo
    
    //Gestione del numero di glifi per ogni riga (per fare una divisione ordinata)
    let quantiInQuestaRiga = 16; // Di default ogni riga ha 16 glifi

    if (riga === 0) {
      quantiInQuestaRiga = 14; // La prima riga è l'unica con 14 glifi
    } else {
      quantiInQuestaRiga = 16; // Tutte le altre righe hanno 16 glifi
    }

    // Passa alla colonna successiva, e se supera il limite va a capo
    col++;
    if (col >= quantiInQuestaRiga) { 
      col = 0;          // Torna all'inizio della riga
      riga++;           // Scende alla riga sotto
    }

  // PARAMETRO "PERCENTUALE DI CRISTIANI" = anelli concentrici
    let numCristiani = myTable.getNum(i, "number_of_christians_wcd+od");
    let popolazioneTotale = myTable.getNum(i, "total_population");

    // Calcolo la percentuale di cristiani sulla popolazione totale
    let percentualeCristiani = 0;
    if (popolazioneTotale > 0) {
      percentualeCristiani = (numCristiani / popolazioneTotale) * 100;
    }

    // Divido la percentuale in 4 fasce per definire quanti anelli disegno
    let numAnelli = 1;
    if (percentualeCristiani >= 50) {
      numAnelli = 4;
    } else if (percentualeCristiani >= 20) {
      numAnelli = 3; 
    } else if (percentualeCristiani >= 5) {
      numAnelli = 2; 
    } else {
      numAnelli = 1;
    }

  // PARAMETRO "WWL TOTAL SCORE" = colore della croce
    let wwlScore = myTable.getNum(i, "total_score_2025");   
    let coloreCroce = '#f89e3e'; 
    if (wwlScore >= 80) {
      coloreCroce = '#e32c07'; 
    } else if (wwlScore >= 60) {
      coloreCroce = '#F25E13'; 
    }

    push();
    translate(x, y);

  // DISEGNO IL GLIFO:
      // Disegno gli anelli
      let coloreAnelli = ['#79bcff','#5473ff','#234cff','#0022b8',]; // Definizione dei colori per tutte le percentuali
      let strokeAnelli = [0.2,0.4,0.6,0.8]; // Definizione dello stroke per tutte le percentuali
      for (let r = 4; r >= 1; r--) {
      let dimensioneAnelli = r * 10 * currentScale; // Più anelli ci sono, più l'aureola si espande attorno alla croce
      let coloreScelto = coloreAnelli[r - 1]; // Seleziona il colore corrispondente all'anello corrente
      let strokeScelto = strokeAnelli[r - 1]; // Seleziona lo spessore del bordo dell'anello
      noFill();

      // Se l'anello rientra nella fascia del paese, lo evidenzio, altrimenti lo rendo meno importante
      if (r === numAnelli) {
        noFill();
        stroke(coloreScelto);
        strokeWeight(strokeScelto + 1); // Aggiungi un po' di spessore all'anello giusto
      } else {
        noFill();
        stroke(coloreScelto, 10); // Trasparente per gli anelli non presenti
        strokeWeight(0.3,10);
      }

      ellipse(0, 0, dimensioneAnelli * 2, dimensioneAnelli * 2);
    }
    
  // DISEGNO LA CROCE:
      fill(coloreCroce);
      noStroke();
      rect(0, 0, 8 * currentScale, 32 * currentScale); 
      rect(0, -4 * currentScale, 20 * currentScale, 8 * currentScale);

  // INTERAZIONE CLICK:
  // Quando clicco sulla croce vedo Ranking + nome del paese
      if (paeseSelezionato !== null && paeseSelezionato.indice === i) {
      push();
      fill(255);
      noStroke();
      textSize(12);
      textAlign(CENTER, BOTTOM);
      textStyle(BOLD);
      
      let testoDaStampare = paeseSelezionato.rank + "." + paeseSelezionato.nome
      text(testoDaStampare, 0, -35); 
      pop();
    }
    pop ();
    }
    }
// FUNZIONE PER DISEGNARE TESTO E LEGENDA:
function Legenda () {
    let yInizioTesti = windowHeight - 120;

  //TESTI LAYOUT:
    // Titolo
      fill('white');
      noStroke();
      textFont('Helvetica');
      textSize(140);
      textStyle(BOLD);
      text("WWL 2025", 80, yInizioTesti - 110);

    // Sottotitolo
      textSize(31.8);
      textFont('Helvetica');
      fill('white');
      text("Discriminazione e persecuzione dei cristiani", 80, yInizioTesti - 60);

    // Descirzione
      textSize(15);
      textStyle(NORMAL);
      fill('white');
      text("Rapporto annuale redatto dall'organizzazione internazionale Porte Aperte (Open Doors) che monitora \ne classifica i 78 Paesi al mondo in cui i cristiani sono maggiormente perseguitati \ne discriminati a causa della loro fede.", 80 , yInizioTesti);

  // LEGENDA PARAMETRI
      let xLegenda = windowWidth - 400;
      let yLegenda = yInizioTesti - 250;
      let distanzarighe = 24 // distanza tra le righe della legenda
      let rigaLegenda = 0; // incrementa per ogni riga della legenda

      // Linea di separazione verticale per la legenda
      stroke(255);
      strokeWeight(1);
      line (xLegenda - 20, yLegenda - 20, xLegenda - 20, yLegenda + 300); 

      // Titolo della legenda
      noStroke();
      textSize(14);
      fill(255);
      textStyle(BOLD);
      text("LEGENDA", xLegenda, yLegenda + (rigaLegenda * distanzarighe));

      // A. Legenda Colori croce (WWL Score)
        rigaLegenda += 1.2;
        noStroke ();
        textSize(12);
        fill(200);
        text("WWL SCORE - Livello di persecuzione", xLegenda, yLegenda + (rigaLegenda * distanzarighe));

        // Croce rossa
          rigaLegenda += 1.1;
          push();
          translate(xLegenda + 8, yLegenda + (rigaLegenda * distanzarighe) - 4);
          fill('#e32c07');
          rect(0, 0, 5, 18);  
          rect(0, -2, 11, 4);  
          pop();
          
          fill(220);
          text("Estrema (Score >= 80)", xLegenda + 25, yLegenda + (rigaLegenda * distanzarighe));

        // Croce arancione
          rigaLegenda += 1.1;
          push();
          translate(xLegenda + 8, yLegenda + (rigaLegenda * distanzarighe) - 4);
          fill('#F25E13');
          rect(0, 0, 5, 18);
          rect(0, -2, 11, 4);
          pop();

          fill(220);
          text("Molto alta (Score 79-60)", xLegenda + 25, yLegenda + (rigaLegenda * distanzarighe));

        // Croce gialla
          rigaLegenda += 1.1;
          push();
          translate(xLegenda + 8, yLegenda + (rigaLegenda * distanzarighe) - 4);
          fill('#f89e3e');
          rect(0, 0, 5, 18);
          rect(0, -2, 11, 4);
          pop();

          fill(220);
          text("Alta (Score < 60)", xLegenda + 25, yLegenda + (rigaLegenda * distanzarighe));


      // B. Legenda Anelli (Percentuale Cristiani)
        rigaLegenda += 1.8;
        textSize(12);
        fill(200);
        text("CRISTIANI PRESENTI - Percentuale rispetto la popolazione totale", xLegenda, yLegenda + (rigaLegenda * distanzarighe));

        textStyle(NORMAL);
        textSize(11);
      
        // Anello 4
          rigaLegenda += 1.4;
          push();
          translate(xLegenda + 8, yLegenda + (rigaLegenda * distanzarighe) - 4);
          stroke('#0022b8');
          noFill();
          strokeWeight(2);
          ellipse(0, 0, 20, 20);
          pop();

          fill(220);
          noStroke();
          text(">= 50% di cristiani", xLegenda+25 , yLegenda + (rigaLegenda * distanzarighe));

        // Anello 3
          rigaLegenda += 1.4;
          push();
          translate(xLegenda + 8, yLegenda + (rigaLegenda * distanzarighe)-4);
          noFill();
          stroke('#234cff');
          strokeWeight(1.5);
          ellipse(0, 0, 16, 16);
          pop();

          fill(220);
          text("20% - 49% di cristiani", xLegenda + 25, yLegenda + (rigaLegenda * distanzarighe));

        // Anello 2
          rigaLegenda += 1.4;
          push();
          translate(xLegenda + 8, yLegenda + (rigaLegenda * distanzarighe)-4);
          noFill();
          stroke('#5473ff');
          strokeWeight(1.2);
          ellipse(0, 0, 12, 12);
          pop();

          fill(220);
          text("5% - 19% di cristiani", xLegenda + 25, yLegenda + (rigaLegenda * distanzarighe));

        // Anello 1
          rigaLegenda += 1.4;
          push();
          translate(xLegenda + 8, yLegenda + (rigaLegenda * distanzarighe)-4);
          noFill();
          stroke('#79bcff');
          strokeWeight(1);
          ellipse(0, 0, 8, 8);
          pop();

          fill(220);
          text("< 5% di cristiani", xLegenda + 25, yLegenda + (rigaLegenda * distanzarighe));
        }

// GESTIONE DEL MOUSE E INTERAZIONE
  function mousePressed () {
  // Controllo se il mouse è sopra un glifo
  let paeseCliccato = isMouseOver(mouseX, mouseY);
  if (paeseCliccato !== null) {
    paeseSelezionato = paeseCliccato; // Seleziona il paese cliccato
  } else {
    paeseSelezionato = null; // Deseleziona se clicco nel vuoto
  }
    redraw (); // Ridisegna lo schermo per mostrare/nascondere il testo
    }

// Funzione per trovare quale glifo è stato cliccato sotto il puntatore del mouse
function isMouseOver(mx, my) {
  // ripetiamo le coordinate
  let totalRows = myTable.getRowCount(); 
  let spazio = 105;      
  let yIniziale = 120;  
  let xIniziale = 120;  
  let col = 0;
  let riga = 0;

  let glifoLarghezza = 70
  let glifoAltezza = 70 

  // Ricalcolo (copia e incolla) la posizione di ogni glifo per verificare il contatto con il mouse
  for (let i = 0; i < totalRows; i++) {
  let x = xIniziale + (col * spazio);
  let y = yIniziale + (riga * spazio);

  let quantiInQuestaRiga = 16; // Di default ogni riga ha 16 glifi
  if (riga === 0) {
      quantiInQuestaRiga = 14; // La prima riga è l'unica con 14 glifi
   } else {
      quantiInQuestaRiga = 16; // Tutte le altre righe hanno 16 glifi
  }

  // Passa alla colonna successiva, e se supera il limite va a capo
  col++;
  if (col >= quantiInQuestaRiga) { 
    col = 0;          // Torna all'inizio della riga
    riga++;           // Scende alla riga sotto
  }

  // Se le coordinate del mouse sono dentro i confini del glifo corrente allora si esegue...
    if (mx > x - (glifoLarghezza / 2) &&
        mx < x + (glifoLarghezza / 2) &&
        my > y - (glifoAltezza / 2) &&
        my < y + (glifoAltezza / 2)) {

  // ... questo, ossia i dati dello specifico paese
      return {
        indice : i, 
        rank: myTable.getNum(i, "rank_2025"),
        nome: myTable.getString(i, "country"),
      };
    }
  }
  return null; // Se non ho cliccato su nessun glifo, allora non succede nulla
  }