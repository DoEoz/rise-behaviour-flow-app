// Simple decision tree for RISE behaviour flow with Head Teacher and Home button
const app = document.getElementById('app');
const promptEl = document.getElementById('prompt');
const buttonsEl = document.getElementById('buttons');
const backEl = document.getElementById('back');

let historyStack = [];

// Define the flow states and transitions
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
    // Head Teacher intervention: provide options for actions or referral
    refer_ht: {
        prompt: 'Head Teacher Intervention',
        options: [
            { label: 'Issue Faculty Detention / Monitoring Card / Restorative Conversation', next: 'ht_follow_up' },
            { label: 'Behaviour meets DP-level criteria (e.g., significant defiance / ongoing truancy / abusive language)', next: 'refer_dp' }
        ]
    },
    // After HT intervention, check if behaviour improved
    ht_follow_up: {
        prompt: 'After HT intervention and reflection, has the behaviour improved?',
        options: [
            { label: 'Yes', next: 'resolved' },
            { label: 'No', next: 'refer_dp' }
        ]
    },
    // DP referral state with suggestions
    refer_dp: {
        prompt: 'Refer to Deputy Principal for intervention. Possible DP Actions: Wednesday Detention, Monitoring Booklet, Restorative Conversation, Formal Caution.',
        options: []
    }
};

// Render the current state by updating the prompt and buttons
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

    // Render navigation buttons: Back and Home
    backEl.innerHTML = '';
    if (historyStack.length > 0) {
        // Back button returns to previous state
        const backBtn = document.createElement('button');
        backBtn.textContent = 'Back';
        backBtn.onclick = () => {
            const prevState = historyStack.pop();
            renderState(prevState);
        };
        backEl.appendChild(backBtn);

        // Home button resets to start
        const homeBtn = document.createElement('button');
        homeBtn.textContent = 'Home';
        homeBtn.onclick = () => {
            historyStack = [];
            renderState('start');
        };
        backEl.appendChild(homeBtn);
    }
}

// Initialize the app
renderState('start');
