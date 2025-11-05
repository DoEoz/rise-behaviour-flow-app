
// Simple decision tree for RISE behaviour flow
const app = document.getElementById('app');
const promptEl = document.getElementById('prompt');
const buttonsEl = document.getElementById('buttons');
const backEl = document.getElementById('back');

let historyStack = [];

const flows = {
    start: {
        prompt: 'Is the behaviour MINOR?',
        options: [
            { label: 'Yes', next: 'minor_warning' },
            { label: 'No (Major)', next: 'major' }
        ]
    },
    major: {
        prompt: 'Major behaviour detected. Immediate referral to DP/Executive.',
        options: []
    },
    minor_warning: {
        prompt: 'Has the student already been given a verbal warning?',
        options: [
            { label: 'Yes', next: 'minor_detention' },
            { label: 'No', next: 'give_warning' }
        ]
    },
    give_warning: {
        prompt: 'Give a verbal warning and continue monitoring.',
        options: []
    },
    minor_detention: {
        prompt: 'Have you issued a Classroom Teacher Reflection or lunch detention?',
        options: [
            { label: 'Yes', next: 'attended_detention' },
            { label: 'No', next: 'issue_detention' }
        ]
    },
    issue_detention: {
        prompt: 'Issue a CT Reflection or lunch detention. Record in CHAS and contact parents.',
        options: []
    },
    attended_detention: {
        prompt: 'Did the student attend the detention?',
        options: [
            { label: 'Yes', next: 'resolved' },
            { label: 'No', next: 'fail_to_attend_once' }
        ]
    },
    resolved: {
        prompt: 'Issue resolved. Continue monitoring.',
        options: []
    },
    fail_to_attend_once: {
        prompt: 'Has the student failed to attend twice?',
        options: [
            { label: 'Yes', next: 'refer_ht' },
            { label: 'No', next: 'reissue_detention' }
        ]
    },
    reissue_detention: {
        prompt: 'Reissue detention and remind the student to attend.',
        options: []
    },
    refer_ht: {
        prompt: 'Refer to Head Teacher for further action.',
        options: []
    }
};

function renderState(stateKey) {
    const state = flows[stateKey];
    promptEl.textContent = state.prompt;
    buttonsEl.innerHTML = '';
    state.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt.label;
        btn.onclick = () => {
            historyStack.push(stateKey);
            renderState(opt.next);
        };
        buttonsEl.appendChild(btn);
    });

    // Show back button if we have history
    backEl.innerHTML = '';
    if (historyStack.length > 0) {
        const backBtn = document.createElement('button');
        backBtn.textContent = 'Back';
        backBtn.onclick = () => {
            const prevState = historyStack.pop();
            renderState(prevState);
        };
        backEl.appendChild(backBtn);
    }
}

// Initialize
renderState('start');
