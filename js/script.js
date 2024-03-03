var calendar;
var Calendar = FullCalendar.Calendar;
var events = [];

$(document).ready(function () {
  $("#add_event_btn").click(function () {
    $("#event_entry_modal").modal("show");
  });
  // Ajoutez ce code pour fermer le modal lorsque vous cliquez sur le bouton de fermeture
  $("#event_entry_modal .closeModal").click(function () {
    $("#event_entry_modal").modal("hide");
  });

  $("{#submit}").click(function (e) {
    e.preventDefault();
    $("#schedule-form").submit();
  });
});

$(function () {
  if (!!scheds) {
    Object.keys(scheds).map((k) => {
      var row = scheds[k];
      events.push({
        id: row.id,
        title: row.title,
        description: row.description,
        start: row.start_datetime,
        end: row.end_datetime,
      });
    });
  }
  var date = new Date();
  var d = date.getDate(),
    m = date.getMonth(),
    y = date.getFullYear();

  calendar = new Calendar(document.getElementById("calendar"), {
    headerToolbar: {
      left: "prev,next today",
      right: "dayGridMonth,dayGridWeek,list",
      center: "title",
    },
    selectable: true,
    themeSystem: "bootstrap",
    //Random default events
    events: events,

    eventClick: function (info) {
      var _details = $("#event-details-modal");
      var id = info.event.id;
      if (!!scheds[id]) {
        _details.find("#title").text(scheds[id].title);
        _details.find("#description").text(scheds[id].description);
        _details.find("#start").text(scheds[id].sdate);
        _details.find("#end").text(scheds[id].edate);
        _details.find("#edit,#delete").attr("data-id", id);
        _details.modal("show");
      } else {
        alert("Event is undefined");
      }
    },
    eventDidMount: function (info) {
      // Do Something after events mounted
    },
    editable: true,
  });

  calendar.render();

  // Form reset listener
  $("#schedule-form").on("reset", function () {
    $(this).find("input:hidden").val("");
    // réinitialiser le contenu de la zone de texte
    // $(this).find("textarea").val("");
    // $(".result").val("");
    result.innerHTML = "";
    $(this).find("input:visible").first().focus();
  });

  // Edit Button
  $("#edit").click(function () {
    // Attache un gestionnaire d'événements 'click' à l'élément avec l'ID 'edit'.
    var id = $(this).attr("data-id");
    // Récupère l'attribut 'data-id' de l'élément sur lequel on a cliqué et le stocke dans la variable 'id'.
    console.log(scheds);
    if (!!scheds[id]) {
      // Vérifie si l'objet 'scheds' contient une propriété correspondant à 'id'.
      var _form = $("#schedule-form");
      //Sélectionne l'élément avec l'ID 'schedule-form' et le stocke dans la variable '_form'.
      $(".modal").modal("hide");
      $("#event_entry_modal").modal("show");
      $("#modalLabel").text("Modify Event Information");
      $("#submit").text("update");

      console.log(
        // Affiche dans la console les informations suivantes :
        scheds[id],
        // L'objet 'scheds' correspondant à 'id'.
        String(scheds[id].start_datetime),
        // La date et l'heure de début de l'événement.
        String(scheds[id].start_datetime).replace(" ", "\\t")
        //  La date et l'heure de début de l'événement, avec tous les espaces remplacés par des tabulations.
      );
      _form.find('[name="id"]').val(id);
      // Trouve l'élément avec l'attribut 'name' égal à 'id' dans '_form' et définit sa valeur à 'id'.
      _form.find('[name="title"]').val(scheds[id].title);
      //  Trouve l'élément avec l'attribut 'name' égal à 'title' dans '_form' et définit sa valeur au titre de l'événement.
      _form.find('[name="description"]').val(scheds[id].description);
      //  Trouve l'élément avec l'attribut 'name' égal à 'description' dans '_form' et définit sa valeur à la description de l'événement.
      //  Trouve l'élément avec l'attribut 'name' égal à 'start_datetime' dans '_form' et définit sa valeur à la date et l'heure de début de l'événement, avec tous les espaces remplacés par 'T'.
      _form
        .find('[name="start_datetime"]')
        .val(String(scheds[id].start_datetime).replace(" ", "T"));
      // Trouve l'élément avec l'attribut 'name' égal à 'end_datetime' dans '_form' et définit sa valeur à la date et l'heure de fin de l'événement, avec tous les espaces remplacés par 'T'.
      _form
        .find('[name="end_datetime"]')
        .val(String(scheds[id].end_datetime).replace(" ", "T"));
      $("#event-details-modal").modal("hide");
      //Met le focus sur l'élément avec l'attribut 'name' égal à 'title' dans '_form'.
      _form.find('[name="title"]').focus();
    } else {
      //Si l'objet 'scheds' ne contient pas de propriété correspondant à 'id'...
      alert("Event is undefined");
    }
  });

  // Delete Button / Deleting an Event
  $("#delete").click(function () {
    var id = $(this).attr("data-id");
    if (!!scheds[id]) {
      var _conf = confirm("Are you sure to delete this scheduled event?");
      if (_conf === true) {
        location.href = "./delete_schedule.php?id=" + id;
      }
    } else {
      alert("Event is undefined");
    }
  });
});

const recordBtn = document.querySelector(".record"),
  result = document.querySelector(".result");
textarea = document.querySelector(".textarea");

let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition,
  recognition,
  recording = false;

function speechToText() {
  try {
    recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recordBtn.classList.add("recording");
    recordBtn.querySelector("p").innerHTML = "Stop Listening...";
    recognition.start();
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      //detect when intrim results
      if (event.results[0].isFinal) {
        result.innerHTML += " " + speechResult;
        // result.querySelector("p").remove();
      } else {
        //creative p with class interim if not already there
        if (!document.querySelector(".interim")) {
          result.appendChild(textarea);
        }
        //update the interim p with the speech result
        document.querySelector(".interim").innerHTML = " " + speechResult;
      }
    };
    recognition.onspeechend = () => {
      if (recording) {
        speechToText();
      }
      // speechToText();
    };
    recognition.onerror = (event) => {
      stopRecording();
      if (event.error === "no-speech") {
        alert("No speech was detected. Stopping...");
      } else if (event.error === "audio-capture") {
        alert(
          "No microphone was found. Ensure that a microphone is installed."
        );
      } else if (event.error === "not-allowed") {
        alert("Permission to use microphone is blocked.");
      } else if (event.error === "aborted") {
        alert("Listening Stopped.");
      } else {
        alert("Error occurred in recognition: " + event.error);
      }
    };
  } catch (error) {
    recording = false;
    console.log(error);
  }
}

recordBtn.addEventListener("click", () => {
  if (!recording) {
    speechToText();
    recording = true;
  } else {
    stopRecording();
  }
});

function stopRecording() {
  recording = false;
  recognition.stop();
  recordBtn.querySelector("p").innerHTML = "Start Listening";
  recordBtn.classList.remove("recording");
}
