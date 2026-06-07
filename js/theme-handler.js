function setTheme(themeName) {

    const currentLink = document.querySelector("#theme");
    const nextHref = `css/themes/${themeName}-theme.css`;

    if (currentLink?.getAttribute("href") === nextHref)
        return;

    const newLink = document.createElement("link");

    newLink.setAttribute("rel", "stylesheet");
    newLink.setAttribute("type", "text/css");
    newLink.setAttribute("href", nextHref);

    if (!currentLink) {
        newLink.setAttribute("id", "theme");
        document.head.appendChild(newLink);
        return;
    }

    newLink.onload = () => {
        currentLink.remove();
        newLink.setAttribute("id", "theme");
    };

    document.head.appendChild(newLink);
}
