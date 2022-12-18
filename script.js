// Votre code ici...

"use strict";

window.onload = () => {
  //selection du dom
  const conteneur = document.getElementById("conteneur-lecteur");

  const infoSong = document.getElementById("info-chanson");

  const lengthSong = document.getElementById("temps-chanson");

  const boutonPrecedent = document.getElementById("btn-precedente");

  const boutonPlay = document.getElementById("btn-play");

  let img = document.getElementsByTagName("img")[0];

  const boutonProchain = document.getElementById("btn-prochaine");

  const repeatSong = document.getElementById("ckbx-boucle");

  let volume = document.getElementById("range-volume");

  let vitesse = document.getElementById("conteneur-lecteur").children[5];

  let theme = document.getElementById("select-theme");

  let chansonQuiJoue = document.createElement("audio");

  //variables
  let indexChanson = 0;

  let isPlaying = false;

  let chansonDuree;

  //liste de chansons
  const listeSong = [
    {
      artiste: "Inconnu",
      titre: "Son de pluie",
      music: "audio/pluie.mp3",
    },
    {
      artiste: "Ludovico Einaudi",
      titre: "Nefeli",
      music: "audio/nefeli.mp3",
    },
    {
      artiste: "David Jalbert",
      titre: "Souvenirs d'enfance",
      music: "audio/souvenirs.mp3",
    },
    {
      artiste: "Le Vent du Nord",
      titre: "Forillon",
      music: "audio/forillon.mp3",
    },
    {
      artiste: "Vincent Vallière",
      titre: "Le temps passe",
      music: "audio/temps.mp3",
    },
    {
      artiste: "Richard Desjardins",
      titre: "Le chant d'un bum",
      music: "audio/bum.mp3",
    },
  ];

  //loader la premiere chanson au debut
  jouerUneChanson(indexChanson);

  //ajout event listener pour fonction de prochaine chanson
  chansonQuiJoue.addEventListener("ended", prochaineChanson);

  //fonction pour jouer une chanson
  function jouerUneChanson(indexChanson) {
    clearInterval(chansonDuree);
    reset();

    //choisir chanson selon la liste
    chansonQuiJoue.src = listeSong[indexChanson].music;

    //afficher les details d'une chanson
    infoSong.textContent =
      listeSong[indexChanson].artiste + " - " + listeSong[indexChanson].titre;

    //updater la duree de chanson a chaque 0.1 seconde
    chansonDuree = setInterval(setUpdate, 100);
  }

  //remettre timer a 0
  function reset() {
    lengthSong.textContent = "00:00" + " / " + "00:00";
  }

  //terniary sur le bouton play/pause pour boolean isPlaying
  function jouePauseChanson() {
    isPlaying ? pauseChanson() : playChanson();
  }
  //ajout event listener
  boutonPlay.addEventListener("click", jouePauseChanson);

  //fonction pour jouer chanson et changer image play/pause
  function playChanson() {
    chansonQuiJoue.play();
    isPlaying = true;
    img.src = "img/pause.jpg";
  }

  //fonction pour pause chanson et changer image play/pause
  function pauseChanson() {
    chansonQuiJoue.pause();
    isPlaying = false;
    img.src = "img/play.jpg";
  }

  //fonction pour prochaine chanson
  function prochaineChanson() {
    if (indexChanson < listeSong.length - 1) {
      indexChanson += 1;
    } else {
      indexChanson = 0;
    }

    jouerUneChanson(indexChanson);
    playChanson();
  }

  //ajout event listener pour bouton prochain
  boutonProchain.addEventListener("click", prochaineChanson);

  //fonction pour chanson precedente
  function chansonPrecedente() {
    if (indexChanson > 0) {
      indexChanson -= 1;
    } else {
      indexChanson = listeSong.length - 1;
    }
    jouerUneChanson(indexChanson);
    playChanson();
  }
  //ajout event listener pour bouton precedente
  boutonPrecedent.addEventListener("click", chansonPrecedente);

  //fonction pour la boucle
  function repeterChanson() {
    //si bouton boucle est cochee
    if (repeatSong.checked) {
      //retrait evenement ended - prochaine chanson
      chansonQuiJoue.removeEventListener("ended", prochaineChanson);

      //ajout  evenement ended - repeter chanson
      chansonQuiJoue.addEventListener("ended", repeatASong);
    }

    //si bouton boucle n'est pas cochee
    else if (!repeatSong.checked) {
      //retrait evenement ended - repeter chanson
      chansonQuiJoue.removeEventListener("ended", repeatASong);

      //ajout  evenement ended - prochaine chanson
      chansonQuiJoue.addEventListener("ended", prochaineChanson);
    }
  }

  //fonction pour repeter chanson
  function repeatASong() {
    let indexChansonQuiJoue = indexChanson;

    jouerUneChanson(indexChansonQuiJoue);
    playChanson();
  }

  //ajout event listener bouton boucle pour repeter chanson
  repeatSong.addEventListener("change", repeterChanson);

  //fonction ajuster le volume
  function ajusterVolume() {
    //ajout setInterval pour que le volume soit ajuster plus rapidement
    setInterval((chansonQuiJoue.volume = volume.value), 10);
  }

  //ajout event listener sur le volume sur mouseUp
  volume.addEventListener("mouseup", ajusterVolume);

  //function ajuster la vitesse
  function ajusterSpeed() {
    chansonQuiJoue.playbackRate = document.querySelector(
      'input[name="radio-vitesse"]:checked'
    ).value;
  }
  //ajout event listener pour la vitesse
  vitesse.addEventListener("change", ajusterSpeed);

  //fonction pour le theme
  function ajouterTheme() {
    //reset classlist with bootstrap classlist excluant couleur
    conteneur.classList = "m-3 p-2 w-50";
    let couleur = theme.options[theme.selectedIndex].value;

    //ajout classlist
    conteneur.classList.add(couleur);
  }

  //ajout event listener change pour le theme
  theme.addEventListener("change", ajouterTheme);

  //fonction pour update le timer
  function setUpdate() {
    let minutes = Math.floor(chansonQuiJoue.currentTime / 60);
    let secondes = Math.floor(chansonQuiJoue.currentTime - minutes * 60);
    let durationMinutes = Math.floor(chansonQuiJoue.duration / 60);
    let durationSecondes = Math.floor(
      chansonQuiJoue.duration - durationMinutes * 60
    );

    if (secondes < 10) {
      secondes = "0" + secondes;
    }
    if (durationSecondes < 10) {
      durationSecondes = durationSecondes = "0" + durationSecondes;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    lengthSong.textContent =
      minutes +
      ":" +
      secondes +
      " / " +
      durationMinutes +
      ":" +
      durationSecondes;
  }
};

/////////////////////////////////////////////////////////////////////////
/**
 * Fonction permettant de savoir la chanson actuelle dans la liste <div id="liste-lecture">.
 * La chanson actuelle est celle qui est actuellement en lecture ou celle qui devrait être jouée
 * si l'utilisateur appuie sur play.
 *
 * @returns Retourne sous forme objet le chanson actuelle
 */
function getChansonActuelle() {
  const chansonActuelle =
    document.getElementsByClassName("chanson-actuelle")[0];
  return {
    artiste: chansonActuelle.dataset.artiste,
    titre: chansonActuelle.dataset.titre,
    source: chansonActuelle.dataset.source,
  };
}

/**
 * Fonction permettant d'avoir la chanson avant la chanson actuelle
 * dans la liste de lecture <div id="liste-lecture">.
 *
 * La chanson précédente devient conséquemment la chanson actuelle.
 *
 * @returns Retourne la chanson précédente sous forme objet.
 */
function getPrecedenteChanson() {
  const chansonActuelle =
    document.getElementsByClassName("chanson-actuelle")[0];
  let chansonPrecedente = chansonActuelle.previousElementSibling;
  if (chansonPrecedente == null)
    chansonPrecedente = chansonActuelle.parentElement.lastElementChild;
  chansonActuelle.className = "";
  chansonPrecedente.className = "chanson-actuelle";
  return {
    artiste: chansonPrecedente.dataset.artiste,
    titre: chansonPrecedente.dataset.titre,
    source: chansonPrecedente.dataset.source,
  };
}

/**
 * Fonction permettant d'avoir la prochaine chanson après la chanson actuelle
 * dans la liste de lecture <div id="liste-lecture">.
 *
 * La prochaine chanson devient conséquemment la chanson actuelle.
 *
 * @returns Retourne la prochaine chanson sous forme objet.
 */
function getProchaineChanson() {
  const chansonActuelle =
    document.getElementsByClassName("chanson-actuelle")[0];
  let prochaineChanson = chansonActuelle.nextElementSibling;
  if (prochaineChanson == null)
    prochaineChanson = chansonActuelle.parentElement.firstElementChild;
  chansonActuelle.className = "";
  prochaineChanson.className = "chanson-actuelle";
  return {
    artiste: prochaineChanson.dataset.artiste,
    titre: prochaineChanson.dataset.titre,
    source: prochaineChanson.dataset.source,
  };
}

/**
 * Fonction permettant de savoir si oui ou non le lecteur est en lecture.
 *
 * @returns true si le lecteur est en lecture, false dans le cas contraire
 */
function estEnLecture() {
  const lecteur = document.getElementById("lecteur");
  return (
    lecteur.currentTime > 0 &&
    !lecteur.paused &&
    !lecteur.ended &&
    lecteur.readyState > 2
  );
}

/**
 * Fonction permettant de convertir un nombre de secondes en
 * un format MM:SS sous forme de chaine de caractères.
 *
 * Tiré de https://stackoverflow.com/a/11234208/4759562
 *
 * @param {number} secs Un nombre de secondes
 * @returns Représentation textuelle en format MM:SS
 */
function formatSecondsAsTime(secs) {
  var hr = Math.floor(secs / 3600);
  var min = Math.floor((secs - hr * 3600) / 60);
  var sec = Math.floor(secs - hr * 3600 - min * 60);
  if (min < 10) min = "0" + min;
  if (sec < 10) sec = "0" + sec;
  return min + ":" + sec;
}
