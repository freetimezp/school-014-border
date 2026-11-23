/* =========================================
   01. ELEMENTS
========================================= */

const previewBox = document.querySelector("#preview-box");
const previewCode = document.querySelector("#preview-code");

const widthSlider = document.querySelector("#border-width");
const widthValue = document.querySelector("#border-width-value");

const styleOptions = document.querySelectorAll(".style-option");
const colorOptions = document.querySelectorAll(".color-option");
const sideOptions = document.querySelectorAll(".side-option");

const resetButton = document.querySelector("#reset-playground");

const challengeOptions = document.querySelectorAll("#challenge-options button");
const challengeFeedback = document.querySelector("#challenge-feedback");

/* =========================================
   02. PLAYGROUND STATE
========================================= */

const defaultSettings = {
    style: "solid",
    width: 4,
    color: "#FA6848",
    side: "all",
};

let settings = { ...defaultSettings };

/* =========================================
   03. BORDER CSS GENERATOR
========================================= */

function getBorderValue() {
    return `${settings.width}px ${settings.style} ${settings.color}`;
}

/* =========================================
   04. APPLY BORDER TO PREVIEW
========================================= */

function updatePreview() {
    if (!previewBox) return;

    const borderValue = getBorderValue();

    // Remove previous border styles
    previewBox.style.border = "none";

    // Reset individual borders
    previewBox.style.borderTop = "none";
    previewBox.style.borderRight = "none";
    previewBox.style.borderBottom = "none";
    previewBox.style.borderLeft = "none";

    // Apply border to all sides
    if (settings.side === "all") {
        previewBox.style.border = borderValue;
    } else {
        // Apply border only to selected side
        previewBox.style[`border${capitalize(settings.side)}`] = borderValue;
    }

    updateCodeOutput();
}

/* =========================================
   05. UPDATE CSS CODE OUTPUT
========================================= */

function updateCodeOutput() {
    if (!previewCode) return;

    let cssCode;

    if (settings.side === "all") {
        cssCode = `border: ${getBorderValue()};`;
    } else {
        cssCode = `border-${settings.side}: ${getBorderValue()};`;
    }

    previewCode.textContent = cssCode;
}

/* =========================================
   06. HELPER FUNCTIONS
========================================= */

function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function updateActiveButtons() {
    // Border styles
    styleOptions.forEach((button) => {
        const isActive = button.dataset.style === settings.style;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", isActive);
    });

    // Colors
    colorOptions.forEach((button) => {
        const isActive = button.dataset.color === settings.color;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", isActive);
    });

    // Border sides
    sideOptions.forEach((button) => {
        const isActive = button.dataset.side === settings.side;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", isActive);
    });
}

/* =========================================
   07. UPDATE WIDTH
========================================= */

function updateWidth() {
    if (!widthSlider || !widthValue) return;

    settings.width = Number(widthSlider.value);

    widthValue.textContent = `${settings.width}px`;

    updatePreview();
}

/* =========================================
   08. BORDER STYLE EVENTS
========================================= */

styleOptions.forEach((button) => {
    button.addEventListener("click", () => {
        settings.style = button.dataset.style;

        updateActiveButtons();
        updatePreview();
    });
});

/* =========================================
   09. COLOR EVENTS
========================================= */

colorOptions.forEach((button) => {
    button.addEventListener("click", () => {
        settings.color = button.dataset.color;

        updateActiveButtons();
        updatePreview();
    });
});

/* =========================================
   10. BORDER SIDE EVENTS
========================================= */

sideOptions.forEach((button) => {
    button.addEventListener("click", () => {
        settings.side = button.dataset.side;

        updateActiveButtons();
        updatePreview();
    });
});

/* =========================================
   11. WIDTH SLIDER EVENT
========================================= */

if (widthSlider) {
    widthSlider.addEventListener("input", updateWidth);
}

/* =========================================
   12. RESET PLAYGROUND
========================================= */

if (resetButton) {
    resetButton.addEventListener("click", () => {
        settings = { ...defaultSettings };

        // Reset slider
        if (widthSlider) {
            widthSlider.value = defaultSettings.width;
        }

        // Reset width label
        if (widthValue) {
            widthValue.textContent = `${defaultSettings.width}px`;
        }

        // Update UI
        updateActiveButtons();
        updatePreview();
    });
}

/* =========================================
   13. BORDER STYLE CHALLENGE
========================================= */

const correctAnswer = "dotted";

let challengeCompleted = false;

challengeOptions.forEach((button) => {
    button.addEventListener("click", () => {
        // Don't allow multiple answers
        if (challengeCompleted) return;

        const selectedAnswer = button.dataset.answer;
        const isCorrect = selectedAnswer === correctAnswer;

        challengeCompleted = true;

        // Visual feedback for selected answer
        button.classList.add(isCorrect ? "correct" : "wrong");

        // Reveal the correct answer
        challengeOptions.forEach((option) => {
            if (option.dataset.answer === correctAnswer) {
                option.classList.add("correct");
            }

            option.disabled = true;
        });

        // Display feedback
        if (challengeFeedback) {
            challengeFeedback.classList.remove("hidden");

            if (isCorrect) {
                challengeFeedback.innerHTML = `
                    <strong>Perfect! 🎉</strong>
                    <p>
                        A dotted border is created using
                        <code>border-style: dotted;</code>.
                        The border is made from small dots.
                    </p>
                `;
            } else {
                challengeFeedback.innerHTML = `
                    <strong>Not quite — let's learn! 💡</strong>
                    <p>
                        The correct answer is <code>dotted</code>.
                        A dotted border consists of small individual dots,
                        while dashed borders use longer line segments.
                    </p>
                `;
            }
        }
    });
});

/* =========================================
   14. RESET CHALLENGE
========================================= */

function resetChallenge() {
    challengeCompleted = false;

    challengeOptions.forEach((button) => {
        button.disabled = false;
        button.classList.remove("correct", "wrong");
    });

    if (challengeFeedback) {
        challengeFeedback.classList.add("hidden");
        challengeFeedback.innerHTML = "";
    }
}

/* =========================================
   15. INITIALIZE
========================================= */

updateActiveButtons();
updatePreview();
