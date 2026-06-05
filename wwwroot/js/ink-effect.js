window.inkEffect = (() => {

    let canvas;
    let ctx;

    const strokes = [];

    let drawing = false;
    let lastPoint = null;

    const STROKE_LIFETIME = 5000;
    const FADE_DURATION = 500;

    let inkColor = "#4f46e5";

    function resize() {

        const dpr = window.devicePixelRatio || 1;

        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;

        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function distance(a, b) {

        const dx = b.x - a.x;
        const dy = b.y - a.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    function widthFromSpeed(speed) {
        return 10;
    }

    function addSegment(from, to) {

        const speed = distance(from, to);

        strokes.push({
            from,
            to,
            width: widthFromSpeed(speed),
            createdAt: performance.now(),
            color: inkColor
        });
    }

    function pointerDown(x, y) {

        drawing = true;

        lastPoint = {
            x,
            y
        };
    }

    function pointerMove(x, y) {

        if (!drawing)
            return;

        const current = { x, y };

        addSegment(lastPoint, current);

        lastPoint = current;
    }

    function pointerUp() {

        drawing = false;
        lastPoint = null;
    }

    function drawSegment(segment, alpha) {

        const mx =
            (segment.from.x + segment.to.x) / 2;

        const my =
            (segment.from.y + segment.to.y) / 2;

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        ctx.moveTo(segment.from.x, segment.from.y);

        ctx.quadraticCurveTo(mx, my, segment.to.x, segment.to.y);

        ctx.lineWidth = segment.width;

        ctx.strokeStyle = segment.color;

        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(segment.from.x + 0.5, segment.from.y + 0.5);

        ctx.quadraticCurveTo(
            mx + 0.5,
            my + 0.5,
            segment.to.x + 0.5,
            segment.to.y + 0.5
        );

        ctx.lineWidth = segment.width * 0.6;

        ctx.strokeStyle = segment.color;

        ctx.stroke();
    }

    function render() {

        const now = performance.now();

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        for (let i = strokes.length - 1; i >= 0; i--) {

            const stroke = strokes[i];

            const age =
                now - stroke.createdAt;

            if (age >= STROKE_LIFETIME) {

                strokes.splice(i, 1);
                continue;
            }

            let alpha = 1;

            if (
                age >
                STROKE_LIFETIME - FADE_DURATION
            ) {

                alpha =
                    1 -
                    (
                        (age -
                            (STROKE_LIFETIME - FADE_DURATION))
                        / FADE_DURATION
                    );
            }

            drawSegment(
                stroke,
                alpha * 0.18
            );
        }

        requestAnimationFrame(render);
    }

    function loadCssVariables(color) {

        var cssVariable = color || "--accent-primary";

        inkColor = getComputedStyle(
            document.documentElement
        )
            .getPropertyValue(cssVariable)
            .trim();
    }

    function isBackgroundClick(target) {

        if (!target)
            return false;

        const interactiveSelector = `
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p,
        a,
        small,
        button,
        input,
        textarea,
        select,
        label,
        summary,
        details,
        [role="button"],
        [role="link"],
        [contenteditable="true"],
        .btn,
        .form-control,
        .nav-link,
        img
        `;

        return !target.closest(interactiveSelector);
    }

    function initEvents() {

        document.addEventListener(
            "mousedown",
            e => {

                if (e.button !== 0)
                    return;

                if (!isBackgroundClick(e.target))
                    return;

                pointerDown(
                    e.clientX,
                    e.clientY
                );
            }
        );

        document.addEventListener(
            "mousemove",
            e => {

                pointerMove(
                    e.clientX,
                    e.clientY
                );
            }
        );

        document.addEventListener(
            "mouseup",
            pointerUp
        );

        document.addEventListener(
            "mouseleave",
            pointerUp
        );
    }

    function setInkColor(color) {
        loadCssVariables(color);
    }

    function init() {

        canvas =
            document.getElementById(
                "inkCanvas"
            );

        if (!canvas)
            return;

        ctx =
            canvas.getContext("2d");

        loadCssVariables();

        resize();

        window.addEventListener(
            "resize",
            resize
        );

        initEvents();

        render();
    }

    return {
        setInkColor,
        init
    };

})();