function updateGPA(selectElement) {
  const gpaInput = selectElement.nextElementSibling;
  gpaInput.value = selectElement.value;
}

function addSubject() {
  const subjectsDiv = document.getElementById("subjects");
  const subjectCount = subjectsDiv.children.length + 1;

  const newSubject = document.createElement("div");
  newSubject.className = "subject-input";
  newSubject.style.opacity = "0";
  newSubject.style.transform = "translateX(-30px)";
  newSubject.innerHTML = `
                <select onchange="updateGPA(this)">
                    <option value="">Select Grade</option>
                    <option value="4">A</option>
                    <option value="3.5">B+</option>
                    <option value="3">B</option>
                    <option value="2.5">C+</option>
                    <option value="2">C</option>
                    <option value="1.5">D</option>
                    <option value="0">F</option>
                </select>
                <input type="number" placeholder="GPA" min="0" max="4" step="0.1" readonly>
                <input type="number" placeholder="Credits" min="1" step="1">
                <button onclick="removeSubject(this)">Remove</button>
                <div class="error-message">Please select a grade and enter valid credits.</div>
            `;

  subjectsDiv.appendChild(newSubject);

  // Animate the new subject
  setTimeout(() => {
    newSubject.style.transition = "all 0.6s ease-out";
    newSubject.style.opacity = "1";
    newSubject.style.transform = "translateX(0)";
  }, 10);
}

function removeSubject(button) {
  const subjectInput = button.parentElement;
  const subjectsDiv = document.getElementById("subjects");

  if (subjectsDiv.children.length > 1) {
    // Animate removal
    subjectInput.style.transition = "all 0.3s ease-out";
    subjectInput.style.opacity = "0";
    subjectInput.style.transform = "translateX(30px)";

    setTimeout(() => {
      subjectInput.remove();
    }, 300);
  } else {
    // Show animated alert
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "⚠️ At least one subject is required!";
    resultDiv.style.background = "rgba(231, 76, 60, 0.2)";
    resultDiv.style.borderColor = "rgba(231, 76, 60, 0.5)";

    setTimeout(() => {
      resultDiv.innerHTML = "";
      resultDiv.style.background = "rgba(255, 255, 255, 0.1)";
      resultDiv.style.borderColor = "rgba(255, 255, 255, 0.2)";
    }, 3000);
  }
}

function resetForm() {
  const subjectsDiv = document.getElementById("subjects");
  subjectsDiv.innerHTML = `
                <div class="subject-input">
                    <select onchange="updateGPA(this)">
                        <option value="">Select Grade</option>
                        <option value="4">A</option>
                        <option value="3.5">B+</option>
                        <option value="3">B</option>
                        <option value="2.5">C+</option>
                        <option value="2">C</option>
                        <option value="1">D</option>
                        <option value="0">F</option>
                    </select>
                    <input type="number" placeholder="GPA" min="0" max="4" step="0.1" readonly>
                    <input type="number" placeholder="Credits" min="1" step="1">
                    <button onclick="removeSubject(this)">Remove</button>
                    <div class="error-message">Please select a grade and enter valid credits.</div>
                </div>
            `;
  document.getElementById("result").textContent = "";
}

function calculateCGPA() {
  const subjectInputs = document.getElementsByClassName("subject-input");
  let totalGradePoints = 0;
  let totalCredits = 0;
  let hasError = false;

  const resultDiv = document.getElementById("result");

  // Show loading animation
  resultDiv.innerHTML = '<div class="loading"></div> Calculating your CGPA...';
  resultDiv.style.background = "rgba(102, 126, 234, 0.2)";
  resultDiv.style.borderColor = "rgba(102, 126, 234, 0.5)";

  // Simulate calculation delay for better UX
  setTimeout(() => {
    for (let i = 0; i < subjectInputs.length; i++) {
      const gradeSelect = subjectInputs[i].children[0];
      const gpaInput = subjectInputs[i].children[1];
      const creditInput = subjectInputs[i].children[2];
      const errorMessage = subjectInputs[i].children[4];

      gradeSelect.classList.remove("error");
      gpaInput.classList.remove("error");
      creditInput.classList.remove("error");
      errorMessage.style.display = "none";

      const gpa = parseFloat(gpaInput.value);
      const credits = parseInt(creditInput.value);

      if (gradeSelect.value === "" || creditInput.value === "") {
        gradeSelect.classList.add("error");
        creditInput.classList.add("error");
        errorMessage.style.display = "block";
        hasError = true;
        continue;
      }

      if (gpa < 0 || gpa > 4 || credits < 1 || isNaN(gpa) || isNaN(credits)) {
        gradeSelect.classList.add("error");
        creditInput.classList.add("error");
        errorMessage.style.display = "block";
        hasError = true;
        continue;
      }

      totalGradePoints += gpa * credits;
      totalCredits += credits;
    }

    if (hasError || totalCredits === 0) {
      resultDiv.innerHTML =
        "❌ Please correct the errors or ensure valid inputs for at least one subject.";
      resultDiv.style.background = "rgba(231, 76, 60, 0.2)";
      resultDiv.style.borderColor = "rgba(231, 76, 60, 0.5)";
      return;
    }

    const cgpa = (totalGradePoints / totalCredits).toFixed(2);

    // Enhanced result display with animations
    if (cgpa > 3.0) {
      resultDiv.innerHTML = `🎉 Your CGPA is: <strong>${cgpa}</strong> 🎉<br><small>Great job! You've done well!</small>`;
      resultDiv.style.background = "rgba(46, 204, 113, 0.2)";
      resultDiv.style.borderColor = "rgba(46, 204, 113, 0.5)";
    } else if (cgpa > 2.0) {
      resultDiv.innerHTML = `👍 Your CGPA is: <strong>${cgpa}</strong> 👍<br><small>Good work! Keep it up!</small>`;
      resultDiv.style.background = "rgba(52, 152, 219, 0.2)";
      resultDiv.style.borderColor = "rgba(52, 152, 219, 0.5)";
    } else {
      resultDiv.innerHTML = `💡 Your CGPA is: <strong>${cgpa}</strong> 💡<br><small>Keep going! You can improve even more!</small>`;
      resultDiv.style.background = "rgba(241, 196, 15, 0.2)";
      resultDiv.style.borderColor = "rgba(241, 196, 15, 0.5)";
    }

    // Add celebration animation
    resultDiv.classList.add("celebration");
    setTimeout(() => {
      resultDiv.classList.remove("celebration");
    }, 600);
  }, 800); // 800ms delay for loading animation
}
