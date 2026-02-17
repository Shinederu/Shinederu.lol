import Title from "@/components/decoration/Title";

const About = () => {
    return (
        <>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 w-11/12 mx-auto mt-8">
                {/* Section 1 */}
                <section className="bg-[#10101f] p-6 rounded-xl border-2 border-[#6a11cb] col-span-1 lg:col-span-2 transform transition-transform duration-300 hover:scale-105">
                    <Title size={2} title="Salut, moi c'est Shinederu !" />
                    <p>
                        Alors moi c'est Shinederu, ou Théo pour les amis, un Suisse actuellement en apprentissage d'informaticien.
                        Je suis plutôt un gars banal et pas très intéressant, mais j'aime passer de bons moments en ligne à jouer avec des potes sur Discord !
                    </p>
                </section>

                {/* Section 2 */}
                <section className="bg-[#10101f] p-6 rounded-xl border-2 border-[#11cb5f] col-span-1 md:col-span-2 transform transition-transform duration-300 hover:scale-105">
                    <Title size={2} title="D'où vient mon pseudo ?" />
                    <p>
                        Mon pseudo vient à la base du Quiz du Grenier du Zevent de 2020... Une des questions était : "Comment s'appelle Splinter en japonais ?"
                        Et je ne sais plus qui a répondu, mais la tentative était un truc du genre "Shinadeiru"... Je trouvais ça "moche mais stylé", alors je l'ai modifié pour "Shinederu" :3
                    </p>
                </section>

                {/* Section 3 */}
                <section className="bg-[#10101f] p-6 rounded-xl border-2 border-[#1124cb] col-span-1 transform transition-transform duration-300 hover:scale-105">
                    <Title size={2} title="Mes passions" />
                    <p>
                        Je joue évidemment aux jeux vidéo, principalement des jeux multijoueurs fun où on peut se taper de bonnes sessions de délire entre amis.
                        Sinon je regarde du YouTube, quelques films (principalement d'animation) et j'ai eu une période où je regardais pas mal d'animés.
                        Je suis aussi fan d'informatique et je développe régulièrement des petits projets pour m'amuser.
                    </p>
                </section>

                {/* Section 4 */}
                <section className="bg-[#10101f] p-6 rounded-xl border-2 border-[#cbbf11] col-span-1 lg:col-span-3 transform transition-transform duration-300 hover:scale-105">
                    <Title size={2} title="Pourquoi je stream ?" />
                    <p>
                        En live, je stream surtout des jeux multi entre potes. Je n'ai pas de thème précis, tant que j'y prends du plaisir.
                        Je suis vraiment pas du genre à me casser la tête là-dessus... D'ailleurs les 3/4 des lives sont lancés à l'arrache pour le fun xD
                    </p>
                    <p>
                        J'avais envie d'essayer, puis j'ai trouvé ça amusant, donc j'ai continué... (et les dons, ça rapporte du pognon mouahahahah).
                    </p>
                </section>

                {/* Section 5 */}
                <section className="bg-[#10101f] p-6 rounded-xl border-2 border-[#cb1111] col-span-1 transform transition-transform duration-300 hover:scale-105">
                    <Title size={2} title="Moments mémorables" />
                    <p>
                        Certains lives ont eu des moments fous, comme un camion qui s'envole sur ETS2 ou des actions incroyables sur certains jeux comme The Finals.
                        Mais pour l'instant, rien qui surpasse tout !
                    </p>
                </section>

                {/* Section 6 */}
                <section className="bg-[#10101f] p-6 rounded-xl border-2 border-[#11bfcb] col-span-1 md:col-span-2 lg:col-span-1 transform transition-transform duration-300 hover:scale-105">
                    <Title size={2} title="Quelques fun facts" />
                    <p>
                        Un talent caché ? Faire des blagues de merde, ça compte ? xD Sinon je ne vois pas trop quoi mettre ici...
                    </p>
                </section>

                {/* Section 7 */}
                <section className="bg-[#10101f] p-6 rounded-xl border-2 border-[#cb11ac] col-span-1 md:col-span-2 transform transition-transform duration-300 hover:scale-105">
                    <Title size={2} title="Citation favorite" />
                    <p>
                        "J'estime ne pas avoir à subir les fantasmes carriéristes d'une entité générationnelle, réactionnaire et oppressive." — Yvain, Kaamelott
                    </p>
                </section>

                {/* Section 8 */}
                <section className="bg-[#10101f] p-6 rounded-xl border-2 border-[#6a11cb] col-span-1 lg:col-span-3 transform transition-transform duration-300 hover:scale-105">
                    <Title size={2} title="Recommandations" />
                    <p>
                        Comme jeu, sans aucun doute Minecraft et Genshin Impact, sur lesquels j'ai passé beaucoup trop de temps pour être toujours aussi nul.
                        Et comme séries, il y en a beaucoup... Kaamelott, The Big Bang Theory, Bloqué, et bien sûr des sagas MP3 comme Le Donjon de Naheulbeuk ou Reflet d'Acide.
                    </p>
                </section>

                {/* Section 9 */}
                <section className="bg-[#10101f] p-6 rounded-xl border-2 border-[#cb5511] col-span-1 transform transition-transform duration-300 hover:scale-105">
                    <Title size={2} title="Pourquoi me suivre ?" />
                    <p>
                        Et pourquoi pas ? Franchement ? Je suis chill, dans la plupart des cas je dis ce que je pense, donc voilà quoi.
                        Je suis pas le plus drôle, le plus déconneur, le plus riche ou autre. Mais au moins je m'assume !
                    </p>
                </section>
            </div>
        </>
    );
};

export default About;
