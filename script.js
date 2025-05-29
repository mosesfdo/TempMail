document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate_button');
    const tempEmailDisplay = document.getElementById('temp_email');
    const copyButton = document.getElementById('copy_button');
    const inboxList = document.getElementById('inbox_list');
    const emailAddressDisplayContainer = document.getElementById('email_address');

    // References to the new About and Contact elements
    const aboutLink = document.getElementById('about_link');
    const contactLink = document.getElementById('contact_link');
    const aboutModal = document.getElementById('aboutModal');
    const contactModal = document.getElementById('contactModal');
    const closeAboutModalButton = document.getElementById('closeAboutModal');
    const closeContactModalButton = document.getElementById('closeContactModal');
    const homeLink = document.getElementById('home_link'); // Added home link

    let emailModal, modalEmailBody, closeModalButton;

    let currentEmail = '';
    let emails = [];
    let emailIdCounter = 0;

    emailAddressDisplayContainer.style.display = 'none';

    function createEmailModalElements() {
        // This function creates the email content modal dynamically if it doesn't exist.
        emailModal = document.createElement('div');
        emailModal.id = 'emailModal';
        emailModal.classList.add('modal');

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');

        closeModalButton = document.createElement('span');
        closeModalButton.classList.add('close-button');
        closeModalButton.innerHTML = '&times;';
        closeModalButton.onclick = closeModal;

        const modalTitle = document.createElement('h2');
        modalTitle.textContent = 'Email Content';

        modalHeader.appendChild(closeModalButton);
        modalHeader.appendChild(modalTitle);

        modalEmailBody = document.createElement('div');
        modalEmailBody.id = 'modal_email_body';

        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalEmailBody);
        emailModal.appendChild(modalContent);
        document.body.appendChild(emailModal);

        // This ensures clicking outside *any* modal closes it
        window.onclick = function(event) {
            if (event.target === emailModal) {
                closeModal();
            } else if (event.target === aboutModal) {
                closeAboutModal();
            } else if (event.target === contactModal) {
                closeContactModal();
            }
        };
    }

    function generateRandomString(length) {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    function formatDate(date) {
        if (!date) return '';
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    function generateEmail() {
        closeAllModals(); // Close all modals when generating new email
        const username = generateRandomString(10);
        const domain = 'tempmail.dev';
        currentEmail = `${username}@${domain}`;

        tempEmailDisplay.textContent = currentEmail;
        emailAddressDisplayContainer.style.display = 'flex';
        copyButton.textContent = '📋 Copy';
        copyButton.disabled = false;

        emails = [];
        emailIdCounter = 0;

        addMockEmail('Welcome Bot', 'Welcome to your Temporary Email!', 'Thanks for generating a new email address. You can use this address for temporary sign-ups and receive emails here. This is a mock email body to demonstrate the functionality. Feel free to replace this with actual email fetching logic if you connect to a backend service.', new Date(Date.now() - 60000 * 5));
        addMockEmail('Support Team', 'Getting Started Guide', 'Here are some tips to get the most out of your temporary inbox: \n1. Generate an email. \n2. Use it on any website. \n3. Check back here for incoming messages. \nRemember, these emails are temporary!', new Date(Date.now() - 60000 * 2));
        addMockEmail('Promotions Daily', 'Exclusive Offer Just For You!', 'Don\'t miss out on our special promotion. Click here to learn more (this is a mock email). This offer includes a 50% discount on all our virtual products for the next 24 hours.', new Date());

        renderInbox();
    }

    function addMockEmail(from, subject, body, date) {
        emails.push({
            id: emailIdCounter++,
            from,
            subject,
            body,
            date: date || new Date(),
            read: false
        });
    }

    function renderInbox() {
        inboxList.innerHTML = '';

        if (emails.length === 0) {
            const row = inboxList.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 4;
            cell.textContent = 'Your inbox is empty.';
            cell.style.textAlign = 'center';
            cell.style.padding = '20px';
            return;
        }

        const sortedEmails = [...emails].sort((a, b) => b.date - a.date);

        sortedEmails.forEach(email => {
            const row = inboxList.insertRow();
            row.style.fontWeight = email.read ? 'normal' : 'bold';

            const fromCell = row.insertCell();
            fromCell.textContent = email.from;

            const subjectCell = row.insertCell();
            subjectCell.textContent = email.subject;
            subjectCell.title = email.subject;

            const dateCell = row.insertCell();
            dateCell.textContent = formatDate(email.date);

            const actionsCell = row.insertCell();
            const viewButton = document.createElement('button');
            viewButton.textContent = 'View';
            viewButton.classList.add('action-btn');
            viewButton.onclick = (event) => {
                event.stopPropagation();
                showEmailContent(email.id);
            };
            actionsCell.appendChild(viewButton);
            actionsCell.style.textAlign = 'center';

            row.addEventListener('click', () => {
                showEmailContent(email.id);
            });
        });
    }

    function copyEmail() {
        if (!currentEmail) return;

        const textArea = document.createElement('textarea');
        textArea.value = currentEmail;
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, 99999);

        try {
            document.execCommand('copy');
            copyButton.textContent = '✅ Copied!';
        } catch (err) {
            copyButton.textContent = '⚠️ Failed';
            const tempMsg = document.createElement('div');
            tempMsg.textContent = `Failed to copy. Please copy manually: ${currentEmail}`;
            tempMsg.style.position = 'fixed';
            tempMsg.style.bottom = '20px';
            tempMsg.style.left = '50%';
            tempMsg.style.transform = 'translateX(-50%)';
            tempMsg.style.backgroundColor = '#ffdddd';
            tempMsg.style.padding = '10px';
            tempMsg.style.border = '1px solid red';
            tempMsg.style.borderRadius = '5px';
            document.body.appendChild(tempMsg);
            setTimeout(() => {
                if (document.body.contains(tempMsg)) {
                    document.body.removeChild(tempMsg);
                }
            }, 3000);
        }
        document.body.removeChild(textArea);

        setTimeout(() => {
            if (copyButton.textContent !== '📋 Copy') {
                    copyButton.textContent = '📋 Copy';
            }
        }, 2000);
    }

    function showEmailContent(emailId) {
        closeAllModals(); // Close other modals before showing email content
        const email = emails.find(e => e.id === emailId);
        if (!email) return;

        email.read = true;

        modalEmailBody.innerHTML = '';

        const fromP = document.createElement('p');
        fromP.innerHTML = `<strong>From:</strong> ${email.from}`;
        modalEmailBody.appendChild(fromP);

        const subjectP = document.createElement('p');
        subjectP.innerHTML = `<strong>Subject:</strong> ${email.subject}`;
        modalEmailBody.appendChild(subjectP);

        const dateP = document.createElement('p');
        dateP.innerHTML = `<strong>Date:</strong> ${formatDate(email.date)}`;
        modalEmailBody.appendChild(dateP);

        const hr = document.createElement('hr');
        hr.style.margin = "15px 0";
        modalEmailBody.appendChild(hr);

        const bodyP = document.createElement('p');
        bodyP.innerHTML = email.body.replace(/\n/g, '<br>');
        modalEmailBody.appendChild(bodyP);

        emailModal.style.display = 'block';

        renderInbox();
    }

    function closeModal() {
        if (emailModal) {
            emailModal.style.display = 'none';
            if (modalEmailBody) {
                modalEmailBody.innerHTML = '';
            }
        }
    }

    // New modal functions
    function openAboutModal() {
        closeAllModals(); // Close any other open modals
        if (aboutModal) {
            aboutModal.style.display = 'block';
        }
    }

    function closeAboutModal() {
        if (aboutModal) {
            aboutModal.style.display = 'none';
        }
    }

    function openContactModal() {
        closeAllModals(); // Close any other open modals
        if (contactModal) {
            contactModal.style.display = 'block';
        }
    }

    function closeContactModal() {
        if (contactModal) {
            contactModal.style.display = 'none';
        }
    }

    function closeAllModals() {
        closeModal(); // Close email content modal
        closeAboutModal();
        closeContactModal();
    }

    // Event Listeners
    generateButton.addEventListener('click', generateEmail);
    copyButton.addEventListener('click', copyEmail);

    // New event listeners for About and Contact links
    aboutLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        openAboutModal();
    });
    contactLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        openContactModal();
    });

    // New event listeners for closing About and Contact modals
    closeAboutModalButton.addEventListener('click', closeAboutModal);
    closeContactModalButton.addEventListener('click', closeContactModal);
    
    createEmailModalElements(); // Ensure the email modal is created

    // Initial state of the inbox
    if (!currentEmail) {
        inboxList.innerHTML = '';
        const row = inboxList.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 4;
        cell.textContent = 'Click "Generate" to get your temporary email and see messages.';
        cell.style.textAlign = 'center';
        cell.style.padding = '20px';
    }

    // Handle Home link click to hide modals
    homeLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        closeAllModals();
    });
});

// These are still useful for external calls if needed, but not strictly required
// if all interactions are within the DOMContentLoaded listener.
window.generateEmail = () => {
    document.getElementById('generate_button').click(); // Simulate a click
};
window.copyEmail = () => {
    document.getElementById('copy_button').click(); // Simulate a click
};