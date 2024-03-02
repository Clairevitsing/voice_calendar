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

  $(".btn.btn-primary.btn-sm.rounded-0[type='submit']").click(function (e) {
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
    var id = $(this).attr("data-id");
    if (!!scheds[id]) {
      var _form = $("#schedule-form");
      console.log(
        String(scheds[id].start_datetime),
        String(scheds[id].start_datetime).replace(" ", "\\t")
      );
      _form.find('[name="id"]').val(id);
      _form.find('[name="title"]').val(scheds[id].title);
      _form.find('[name="description"]').val(scheds[id].description);
      _form
        .find('[name="start_datetime"]')
        .val(String(scheds[id].start_datetime).replace(" ", "T"));
      _form
        .find('[name="end_datetime"]')
        .val(String(scheds[id].end_datetime).replace(" ", "T"));
      $("#event-details-modal").modal("hide");
      _form.find('[name="title"]').focus();
    } else {
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
