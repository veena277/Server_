const cars = {
    abcd: {
      id: "#10101",
      Type: "Car",
      Number_plate: "ABC123",
      entry_time: 2,
      exit_time: 2019,
      "Parking-slot_id": 1,
      "Parking-slot_name": "A1",
    },
    efg: {
      id: "#10101",
      Type: "Car",
      Number_plate: "ABC123",
      entry_time: 2,
      exit_time: 2019,
      "Parking-slot_id": 1,
      "Parking-slot_name": "A1",
    },
    hij: {
      id: "#10101",
      Type: "Car",
      Number_plate: "ABC123",
      entry_time: 2,
      exit_time: 2019,
      "Parking-slot_id": 1,
      "Parking-slot_name": "A1",
    },
    klmn: {
      id: "#10101",
      Type: "Car",
      Number_plate: "ABC123",
      entry_time: 2,
      exit_time: 2019,
      "Parking-slot_id": 1,
      "Parking-slot_name": "A1",
    },
  };

 
  function findDescription() {
    const plateNumber = document.getElementById("plateNumber").value;
    const descriptionArea = document.getElementById("descriptionArea");

    if (plateNumber in cars) {
      const car = cars[plateNumber];
      let details = `Vehicle ID: ${car.id}\nType: ${car.Type}\nNumber Plate: ${car.Number_plate}\nEntry Time: ${car.entry_time}\nExit Time: ${car.exit_time}\nParking Slot ID: ${car["Parking-slot_id"]}\nParking Slot Name: ${car["Parking-slot_name"]}`;
      descriptionArea.value = details;
    } else {
      descriptionArea.value =
        "Description not available or invalid car number plate.";
    }
  }

  
document.getElementById("findDescriptionButton")
document.addEventListener("click", findDescription);