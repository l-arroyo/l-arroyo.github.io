window.sectionObserver = {

    init: (dotnetHelper) => {

        const sections = document.querySelectorAll("section[id]");

        const observer = new IntersectionObserver((entries) => {

            let visible = entries
                .filter(e => e.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (!visible) return;

            const id = visible.target.id;

            dotnetHelper.invokeMethodAsync("ShouldIgnoreObserver")
                .then(ignore => {

                    if (ignore) return;

                    dotnetHelper.invokeMethodAsync("SetActiveSection", id);
                });

        }, {
            threshold: [0.3, 0.5, 0.7]
        });

        sections.forEach(s => observer.observe(s));
    }
};