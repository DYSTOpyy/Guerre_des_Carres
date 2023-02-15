guerre_des_carres
===============

Pixel War mais avec peu de budget

Tableau de pixels qui contient dans chaque case une classe avec 
- le nom du gars qui l'a mis
- la date
- la couleur du pixel

===============
A FAIRE

sauvegarder le nom du gars dans le dico du js, pas dans les cookies car si il le modifie c'est le bordel
choix de couleurs limités

- finir l'interface de choix des couleurs

    - choisir un bloc, choisir la couleur et hop le bloc change OU L'INVERSE 

        - choisir un bloc === mettre son contour ! et enlever le contout de l'ancien !

ACTUELLEMENT : en sélectionnant une couleur sur le côté, je peut changer la couleur du truc blanc.
Il faut finir l'interface pour la rendre opérationelle (et donc savoir comment maxime gère ses pixels car moi je me base sur les id des boutons)
cad choisir le bloc, choisir la couleur et ça la modifie

- trouver une solution pour partager avec les nouveaux arrivants
   dès qu'un nouveau arrive on récupère l'état actuel du jeu sur le premier du tableau, puis on fout le nouveau dans le tableau

- stocker l'état du tableau

- page d'accueil 

nouveau : donner pseudo + cookie d'auth
deja vu : rien faire
--> passe au jeux

- cookie de session (sauf si existant)
    un tableau avec tous les utilisateurs, une file (le premier est le dernier arrivé)

- pseudo

=====================
Mise a jour 0.2

- Clean le code 
    - Un seul JS
        - Le mettre dans un dossier JS
        - Pouvoir lancer les deux pages .html
        - Faire un sorte que les deux versions fonctionnent
    - organiser les css

=====================
Mise à jour 0.3

-La même chose 
- plus :    
    -Implementation pinceau
- moins :
    - dossier JS
    - les 2 pages

    