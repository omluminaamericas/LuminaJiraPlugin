// ==UserScript==
// @name         Lumina Jira Plugin
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Gustavo Pérez
// @description  Inserts icons to update estimation and trigger an external webhook via API automatically only for Epics in Jira Cloud UI.
// @match        *://*.atlassian.net/browse/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/omluminaamericas/LuminaJiraPlugin/main/LuminaJiraPlugin.user.js
// @downloadURL  https://raw.githubusercontent.com/omluminaamericas/LuminaJiraPlugin/main/LuminaJiraPlugin.user.js
// ==/UserScript==

(function () {
    'use strict';

    const ESTIMATION_API_URL = 'http://jira-hub-cloud-apps-dev.k8stst.ar.lumina.net/jira-cloud-apps/scripted/execUpdateEffortEstimation?jiraID=';
    const WEBHOOK_URL_BASE = 'https://api-private.atlassian.com/automation/webhooks/jira/a/83fe54ba-a8c5-46fa-b12d-90bd330096c1/0197a388-4097-7e42-b9a4-17afedb5916e?issue=';
    const WEBHOOK_TOKEN = '6daa6c751e1a26b31cf0d6559528f118f96a57ea';

    function getJiraId() {
        const match = window.location.pathname.match(/\/browse\/([A-Z]+-\d+)/);
        return match ? match[1] : null;
    }

    function hasEstimationTab() {
        const tabs = document.querySelectorAll('[role="tab"]');
        return Array.from(tabs).some(tab => tab.textContent.trim() === 'Estimation');
    }

    function isEpicIssue() {
        const issueTypeElem = document.querySelector('[data-testid="issue.views.issue-base.foundation.change-issue-type.button"]');
        return issueTypeElem && issueTypeElem.getAttribute('aria-label') &&
            issueTypeElem.getAttribute('aria-label').trim().toLowerCase().includes('epic');
    }

    function createButton(jiraId) {
        const button = document.createElement('button');
        button.id = 'btn-estimacion-jira';
        button.title = 'Refresh estimation now';
        button.textContent = '⟳';

        button.style.all = 'unset';
        button.style.cursor = 'pointer';
        button.style.marginLeft = '8px';
        button.style.fontSize = '18px';
        button.style.lineHeight = '1';

        button.addEventListener('click', () => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: ESTIMATION_API_URL + jiraId,
                onload: (response) => {
                    if (response.status === 200) {
                        showToast('✅ Estimación actualizada para ' + jiraId);
                    } else {
                        showToast('❌ Error al actualizar estimación: ' + response.status, true);
                    }
                },
                onerror: (error) => {
                    alert('❌ Error en la llamada');
                    console.error(error);
                }
            });
        });

        return button;
    }

    function createWebhookButton(jiraId) {
        const button = document.createElement('button');
        button.id = 'btn-webhook-jira';
        button.title = 'Update total story points';
        button.textContent = '✯';

        button.style.all = 'unset';
        button.style.cursor = 'pointer';
        button.style.marginLeft = '8px';
        button.style.fontSize = '18px';
        button.style.lineHeight = '1';

        button.addEventListener('click', () => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: WEBHOOK_URL_BASE + jiraId,
                headers: {
                    'X-Automation-Webhook-Token': WEBHOOK_TOKEN
                },
                onload: (response) => {
                    if (response.status === 200 || response.status === 204) {
                        showToast('✅ Webhook enviado para ' + jiraId);
                    } else {
                        showToast('❌ Error en suma: ' + response.status, true);
                    }
                },
                onerror: (error) => {
                    alert('❌ Error en la llamada');
                    console.error(error);
                }
            });
        });

        return button;
    }

    function insertButtons() {
        const jiraId = getJiraId();
        const container = document.querySelector('[data-testid="issue.views.issue-base.foundation.status.actions-wrapper"]');
        if (!jiraId || !container) return;

        let btnEstimacion = document.querySelector('#btn-estimacion-jira');
        if (hasEstimationTab()) {
            if (!btnEstimacion) {
                btnEstimacion = createButton(jiraId);
                container.appendChild(btnEstimacion);
            }
        } else if (btnEstimacion) {
            btnEstimacion.remove();
        }

        let btnWebhook = document.querySelector('#btn-webhook-jira');
        if (isEpicIssue()) {
            if (!btnWebhook) {
                btnWebhook = createWebhookButton(jiraId);
                container.appendChild(btnWebhook);
            }
        } else if (btnWebhook) {
            btnWebhook.remove();
        }
    }

    function showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.padding = '10px 16px';
        toast.style.backgroundColor = isError ? '#e03c31' : '#36b37e';
        toast.style.color = 'white';
        toast.style.borderRadius = '4px';
        toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        toast.style.zIndex = '9999';
        toast.style.fontSize = '14px';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';

        document.body.appendChild(toast);

        setTimeout(() => { toast.style.opacity = '1'; }, 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    window.addEventListener('load', insertButtons);
    const observer = new MutationObserver(() => insertButtons());
    observer.observe(document.body, { childList: true, subtree: true });

})();
