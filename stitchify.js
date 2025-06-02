const extractCodeMirrorContent = (codeMirrorElement) => {
    const codeMirror = codeMirrorElement.querySelector('textarea.CODE-TEXTAREA');
    if (!codeMirror) return null;

    const codeMirrorContent = codeMirror.textContent.trim();

    return codeMirrorContent;
};

const shouldShowButton = () => {
    const main = document.querySelector('main#main');
    if (!main) return false;

    const sectionContent = main.querySelector('.section-content');
    if (!sectionContent) return false;

    const section = sectionContent.querySelector('.section');
    if (!section) return false;

    const sectionHead = section.querySelector('.section-head');
    if (!sectionHead) return false;

    return true;
};

const getButtonContainer = () => {
    // Find the main container and navigate to the section-head div
    const main = document.querySelector('main#main');
    if (!main) return null;

    const sectionContent = main.querySelector('.section-content');
    if (!sectionContent) return null;

    const section = sectionContent.querySelector('.section');
    if (!section) return null;

    const sectionHead = section.querySelector('.section-head');
    return sectionHead;
};

// Helper for creating Result types
const Ok = value => ({ ok: true, value });
const Err = error => ({ ok: false, error });

const getCSSSelection = () => {
    const CSS_TYPE = 'SCSS Dark';
    const radioInput = document.querySelector(`input.radio-styles[type="radio"][data-css-type="${CSS_TYPE}"]`);
    if (!radioInput) return Err(`Could not find the ${CSS_TYPE} radio input`);

    const codeId = radioInput.value;
    if (!codeId) return Err('Radio input has no value');

    const codeElement = document.querySelector(`.CODE_TABS__BODY [data-codeid="${codeId}"]`);
    if (!codeElement) return Err('Could not find corresponding CSS code element');

    return Ok(extractCodeMirrorContent(codeElement));
};

const getHTMLSelection = () => {
    // Find the CORE_TABS__BODY element and get its first child
    const coreTabsBody = document.querySelector('.CODE_TABS__BODY');
    if (!coreTabsBody) return Err('Could not find CODE_TABS__BODY element');

    const htmlElement = coreTabsBody.firstElementChild;
    if (!htmlElement) return Err('No HTML content found in CODE_TABS__BODY');

    return Ok(extractCodeMirrorContent(htmlElement));
};


const getJSSelection = () => {
    const linkElement = document.querySelector('a.code_list_link[data-codetype="js"]');
    if (!linkElement) return Err('Could not find the JS link element');

    const codeId = linkElement.getAttribute('data-codeid');
    if (!codeId) return Err('Link element has no data-codeid attribute');

    const codeElement = document.querySelector(`.CODE_TABS__BODY [data-codeid="${codeId}"]`);
    if (!codeElement) return Err('Could not find corresponding JS code element');

    return Ok(extractCodeMirrorContent(codeElement));
};

const combineContents = (html, css, js) => `
${html}

<style lang="scss">
${css}
</style>
${js ? `

<script>
${js}
</script>` : ''}`;

const getContentSelections = () => {
    const htmlResult = getHTMLSelection();
    const cssResult = getCSSSelection();
    const jsResult = getJSSelection();

    return htmlResult.ok && cssResult.ok
        ? Ok(combineContents(
            htmlResult.value,
            cssResult.value,
            jsResult.ok ? jsResult.value : null
        ))
        : Err('Failed to get required content');
};

// Create and style the button
function createStitchButton() {
    const button = document.createElement('button');
    button.textContent = 'Copy Test Component';
    button.style.cssText = `
        background: none;
        border: 1px solid #ccc;
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 4px;
        font-size: 14px;
        margin: 8px;
        transition: background-color 0.2s;
    `;

    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#f0f0f0';
    });

    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = 'transparent';
    });

    return button;
}

const updateButtonText = (button, text, duration = 2000) => {
    const originalText = button.textContent;
    button.textContent = text;
    setTimeout(() => {
        button.textContent = originalText;
    }, duration);
};

// Handle the button click and content copying
async function handleStitchButtonClick() {
    const button = document.querySelector('.stitch-button');
    
    const content = getContentSelections();
    if (!content.ok) {
        updateButtonText(button, content.error, 2000);
        return;
    }

    const result = await navigator.clipboard.writeText(content.value)
        .then(() => Ok('Copied!'))
        .catch(() => Err('Error!'));

    updateButtonText(button, result.ok ? result.value : result.error, 2000);
}

// Main initialization function
function initializeStitchify() {
    if (!shouldShowButton()) {
        return;
    }

    const container = getButtonContainer();
    if (!container) {
        console.warn('Button container not found');
        return;
    }

    const button = createStitchButton();
    button.classList.add('stitch-button');
    button.addEventListener('click', handleStitchButtonClick);

    container.appendChild(button);
}

// Initialize when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStitchify);
} else {
    initializeStitchify();
}
