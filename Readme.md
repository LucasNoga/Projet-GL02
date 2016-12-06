# README - Yadom - GG IZI - Projet GL02 - livrable 2 - A16

# 1)Description :
Le groupe "Hello World" nous a proposé de réaliser un projet qui lui a été demandé de spécifier par l'entreprise Yadom. 
Celle-ci a pour but d'aider les personnes âgées de la ville de Yers en coordonnant les divers interventions que celles-ci peuvent recevoir. 
Cependant, ils ont de plus en plus de mal à gérer leur logiciel avec le nombre d'emplois du temps qu'ils gèrent, autant pour
les personnes âgées que pour les différents intervenants. Notre mission consiste donc à implementer 
le cahier des charges qui nous a été proposé afin d'améliorer le logiciel PlanInfo de l'équipe de Yadom.

Remarques : Le développement de cette solution a tenté de suivre dans la mesure du possible le cahier des charges définissant ce projet.
Certaines fonctions ne répondront donc peut-être pas aux attentes, ceci étant dû au manque de clarté dont pouvait faire preuve, parfois, le cahier des charges proposé.


# 2)Explication du programme
Le but est de pouvoir facilement "naviguer" entre des fichiers iCalendar et planInfo nous avons donc créer un objet intermédiaire, Planning, qui 
lors d'une conversion d'un fichier planInfo en iCalendar nous aurons d'abord la conversion du fichier planInfo en Planning puis de Planning en iCalendar
un objet Planning contient une liste d'objet RendezVous.


# 3)Explication de l'arborescence
main.js : programme principale qui représente l'interface utilisateur
affichage.js : regroupe tous les fonctions d'affichage pour la console (exemple: afficher les fichier du repertoire files)
client.js :
parser_ical.js : fichier qui va parser un fichier iCal (.ics) et recuperer chaque rdv dans un objet RendezVous qui lui sera ajouté dans un objet Planning 
parser_planinfo.js : fichier qui va parser un fichier PlanInfo (.csv) et recuperer chaque rdv dans un objet RendezVous et qui sera lui ajouté dans un objet Planning 
planning.js: fichier permettant de récuperer tous les RendezVous d'un fichier .ics ou .csv qui permet par la suite de faire la conversion vers un autre fichier
rdv.js : fichier permettant de créer un RendezVous avec un titre, un intervenant, une date, une durée et un lieu
serializer_ical.js : permet de créer un fichier iCal (.ics) à partir d'un planning
serializer_planinfo.js : permet de créer un fichier planInfo (.csv) à partir d'un planning
aide.js : fichier qui permet d'afficher dans la console le fichier ReadMe.md
files/ : répertoire contennant des fichiers de types .csv et .ics pour pouvoir tester notre programme
test/ : repertoire contennant les tests unitaires avec le fichier runTest.js qui permet de lancer tous les fichiers de test
doc/ : contient la documentation de chaque <fichier.js> du programme


# 4)Version du programme
v1.0: Création du parser pour Ical + la commande d'aide
v2.0: Création du parser_planInfo.js + création du serializer.ical + ajout de nouveau fichiers de test
v3.0: Création de l'interface en ligende de commande dans le fichier main.js pour l'utilisateur


# 5)Installation:
Assurez vous d'avoir nodejs d'installé sur votre ordinateur. 
Ce logiciel a été testé avec les version 4.2.6 et 6.9.1 de nodejs sous Mac OS X Sierra, Windows 10, Ubuntu 16.04 LTS.
Les modules npm à installer sont:
    - qunit qui permet d'effectuer des test unitaires simple avec un affichage explicite dans la console,
    - readline-sync qui permet à l'utilisateur d'interagir avec la console,
Pour lancer le programme, placez vous dans le dossier avec votre terminal.
Pour executer le programme taper : node main.js
Ensuite vous pourrez interagir avec la ligne de commande.


# 6)Notice d'utilisation
node main.js pour accéder à l'interface utilisateur en command line
node parser_ical.js pour avoir en sortie un Planning du fichier iCalendar (.ics)
node parser_planinfo.js pour avoir en sortie un Planning du fichier planInfo (csv)


# 7)Liste des commandes
Lors du lancement du programme une liste de commande est proposé vous avez le choix parmi:
1 - Importer des plannings
2 - Détecter des conflits entre 2 plannings
3 - Exporter un planning au format PlanInfo
4 - Exporter un planning au format iCal
5 - Afficher un planning
6 - Affiche le fichier ReadMe
7 - Affiche la version de la librairie

# 8)Test
Lorsque vous êtes dans votre projet,
dans un premier temps veuillez installer le module qunit avec la commande npm install --save-dev qunit si cela ne fonctionne pas essayer npm install --save-dev qunitjs
placez vous ensuite dans le repertoire /branches/tests puis lancez la commande node runTest.js pour lancer les tests.
le fichier tests_rdv.js permet de tester les objets de la classe RendezVous.
le fichier tests_planning.js pour tester les objets planning


# 10) Equipe 
Projet réalisé par :
Benjelloun Adam
Hurtaud Cesar
Zhang Yi
Noga Lucas
Accompagné du professeur responsable de l’UE GL02 Mathieu Tixier, ainsi que notre professeure de TD Ines DI LORETO