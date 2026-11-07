// Rimando a Study Hub: la pagina indica la destinazione in data-target; da studio/?t=<id>
// si va direttamente all'argomento corrispondente.
(function () {
  var s = document.currentScript;
  var d = s && s.dataset.target;
  if (!d) return;
  try {
    if (/\/studio\/$/.test(location.pathname)) {
      var m={"I-01": "modellamento-costanti-concentrate", "I-02": "leggi-di-kirchhoff", "I-03": "porta-e-bipolo", "I-04": "linearita-passivita-causalita", "I-05": "relazioni-costitutive", "I-06": "energia-e-bipoli-reali", "I-07": "generatori-controllati", "I-08": "trasformatore-ideale", "I-09": "nullore-e-amplificatore-operazionale", "II-01": "grafo-maglie-tagli", "II-02": "albero-coalbero", "II-03": "matrici-a-b", "II-04": "tensioni-correnti-indipendenti", "II-05": "teorema-di-tellegen", "II-06": "serie-parallelo-partitori", "II-07": "metodo-dei-nodi", "II-08": "metodo-delle-maglie", "III-01": "circuiti-primo-ordine", "III-02": "fasori", "III-03": "impedenza-ammettenza", "III-04": "applicabilita-fasori", "III-05": "sovrapposizione-frequenze-diverse", "III-06": "potenza-complessa", "III-07": "conservazione-potenza-complessa", "III-08": "rifasamento", "IV-01": "laplace-definizione-proprieta", "IV-02": "trasformate-notevoli", "IV-03": "fratti-semplici", "IV-04": "poli-complessi-coniugati", "IV-05": "equazioni-integro-differenziali", "IV-06": "circuiti-dominio-laplace", "IV-07": "condizioni-iniziali-generatori", "V-01": "funzioni-di-rete", "V-02": "risposta-impulsiva-convoluzione", "V-03": "risposta-libera-forzata", "V-04": "stabilita-poli", "V-05": "risposta-transitoria-permanente", "V-06": "fasori-e-laplace", "V-07": "risposta-in-frequenza-filtri", "V-08": "circuiti-risonanti", "VI-01": "teorema-di-sostituzione", "VI-02": "teorema-di-thevenin", "VI-03": "teorema-di-norton", "VI-04": "reti-n-porte", "VI-05": "doppi-bipoli-z-y", "VI-06": "altre-rappresentazioni-doppi-bipoli", "VI-07": "connessioni-doppi-bipoli", "VI-08": "prove-validita-connessioni", "VI-09": "massimo-trasferimento-potenza"};var t=new URLSearchParams(location.search).get('t');if(t&&m[t])d="https://valeriocolapinto1-cpu.github.io/study-hub/it/anno-2/teoria-circuiti/teoria/"+m[t]+'/'+location.hash;
    }
  } catch (e) {}
  location.replace(d);
})();
