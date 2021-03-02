let lastCommentsLength;

const colors = {
    wait: 'purple',
    done: 'green',
    reject: 'red',
}

const getButton = (id, type) => {
    const elem = document.createElement('button');
    elem.textContent = type;
    elem.className = 'marked_comments_action_btn';
    elem.addEventListener('click', () => {
        chrome.storage.sync.get(['marked_comments'], (storage) => {
            if (storage && storage.marked_comments) {
                const newComments = [...storage.marked_comments, { id, type }];
                chrome.storage.sync.set({ "marked_comments": newComments}, () => {
                    document.querySelector(`#${id}`).style.backgroundColor = colors[type];
                })
            } else {
                chrome.storage.sync.set({ "marked_comments": [{ id, type }]}, () => {
                    document.querySelector(`#${id}`).style.backgroundColor = colors[type];
                })
            }
        })
        
    });
    return elem;
}

const markElements = (markedComments) => {
    if (markedComments) {
        markedComments.forEach(({ id, type }) => {
            const el = document.querySelector(`#${id}`);
            if (el) {
                el.style.backgroundColor = colors[type];
            }
        })
    }
}

const init = () => {
    chrome.storage.sync.get(['marked_comments'], (storage) => {
        console.log('INIT')
        markElements(storage.marked_comments)
        const comments = document.querySelectorAll('.review-comment');
        lastCommentsLength = comments.length;
        const buttons = document.querySelectorAll('.marked_comments_action_btn');
        buttons.forEach(button => button.remove());
        comments.forEach(comment => {
            const timeline = comment.querySelector('.unminimized-comment .timeline-comment-actions');
            timeline.append(getButton(comment.id, 'done'));
            timeline.append(getButton(comment.id, 'wait'));
            timeline.append(getButton(comment.id, 'reject'));
        })    
    })
}

if (window.location.hostname === 'github.com' && window.location.pathname.includes('pull')) {
    init();
    setInterval(() => {
        const comments = document.querySelectorAll('.review-comment');
        if (comments.length !== lastCommentsLength) {
            init();
        }
    }, 5000);
}
