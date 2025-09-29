
function cleanHtml(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.innerHTML
        .replace(/>\s+</g, '><') // remove extra whitespace between tags
        .trim();
}

function splitIntoBlocks(html) {
    return html.split(/(<\/(?:p|h[1-6]|ul|ol|blockquote)>)/i)
               .reduce((acc, part) => {
                   if (part.match(/<\/(?:p|h[1-6]|ul|ol|blockquote)>/i) && acc.length) {
                       acc[acc.length - 1] += part;
                   } else if (!part.match(/<\/(?:p|h[1-6]|ul|ol|blockquote)>/i)) {
                       if (part.trim()) acc.push(part.trim());
                   }
                   return acc;
               }, []);
}

function protectTags(html) {
    const tags = [];
    html = html.replace(/<[^>]+>/g, (match) => {
        tags.push(match);
        return `{{TAG_${tags.length - 1}}}`;
    });
    return { html, tags };
}

function restoreTags(text, tags) {
    return text.replace(/{{TAG_(\d+)}}/g, (_, i) => tags[i] || '');
}

function compareHTML(html1, html2) {
    const dmp = new diff_match_patch();

    const normalizedHtml1 = cleanHtml(html1);
    const normalizedHtml2 = cleanHtml(html2);

    const blocks1 = splitIntoBlocks(normalizedHtml1);
    const blocks2 = splitIntoBlocks(normalizedHtml2);

    let resultHtml = "";

    const maxLength = Math.max(blocks1.length, blocks2.length);
    for (let i = 0; i < maxLength; i++) {
        const block1 = blocks1[i] || "";
        const block2 = blocks2[i] || "";

        const p1 = protectTags(block1);
        const p2 = protectTags(block2);

        const diffs = dmp.diff_main(p1.html, p2.html);
        dmp.diff_cleanupEfficiency(diffs);

        diffs.forEach(([op, text]) => {
            let restoredText;
            if (op === 1) { // INSERT
                restoredText = restoreTags(text, p2.tags);
                resultHtml += `<span class="diff-insert">${restoredText}</span>`;
            } else if (op === -1) { // DELETE
                restoredText = restoreTags(text, p1.tags);
                resultHtml += `<span class="diff-delete">${restoredText}</span>`;
            } else { // EQUAL
                const r1 = restoreTags(text, p1.tags);
                const r2 = restoreTags(text, p2.tags);
                restoredText = (r1 === r2) ? r1 : r1;
                resultHtml += `<span class="diff-equal">${restoredText}</span>`;
            }
        });
    }

    return {
        success: true,
        html: resultHtml
    };
}

function displayDiff(html1, html2) {
    const results = compareHTML(html1, html2);
    if (results.success) {
        document.getElementById('displayHTML').innerHTML = results.html;
    } else {
        console.error(results.error);
    }
}

