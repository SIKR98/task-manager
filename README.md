Task Manager – Angular + Supabase
Ett skolprojekt för att hantera projekt och uppgifter – med stöd för prioritet, deadlines och status. Applikationen är byggd i Angular och använder Supabase som backend.

Installation
Klona projektet
git clone https://github.com/SIKR98/task-manager.git
cd task-manager

Installera beroenden
npm install

Starta utvecklingsservern
ng serve

Öppna i webbläsaren:
http://localhost:4200

Funktioner
Skapa, uppdatera och ta bort projekt

Lägg till uppgifter kopplade till projekt

Hantera deadlines, prioritet och status

Formulär med validering

Supabase används som databas

Enhetstester med Jasmine och Karma

Teknisk dokumentation
Projektet använder standalone-komponenter i Angular. All formulärlogik bygger på Reactive Forms. Supabase används som backend-tjänst (PostgreSQL). Signals används för att hantera state i klienten.

Filstruktur:

components/ innehåller formulär för projekt och uppgifter

pages/ innehåller vyer

core/services/ innehåller datatjänster

models/ innehåller typer och interfaces

Teknologier:

Angular 17

Supabase

TypeScript

Reactive Forms

Angular Signals

Jasmine & Karma

API – Supabase
Appen använder Supabase direkt för att lagra och hämta data.

Hämta alla projekt: supabase.from('projects').select('*')

Lägg till projekt: supabase.from('projects').insert(...)

Uppdatera projekt: supabase.from('projects').update(...)

Ta bort projekt: supabase.from('projects').delete()

Samma gäller för tasks, som inkluderar fält som title, status, priority, deadline, project_id.

Reflektioner
Jag valde att använda standalone-komponenter för att slippa hålla på med moduler. Reactive Forms gjorde det lättare att validera användarens input. Supabase gjorde det möjligt att bygga en fullstack-liknande app utan att skriva egen backend. Det svåraste var att mocka Supabase korrekt i tester och att få ActivatedRoute att fungera i testsammanhang. Det var också en utmaning att använda Angular Signals då dokumentationen fortfarande är ny.

Testning
Kör tester med kommandot:
ng test

Det finns tester för komponenter som project-form och task-form, samt tjänsten ProjectService och huvudkomponenten AppComponent.

Skärmdumpar
Skärmdumpar finns i mappen screenshots/.

Startsida: lista projekt

Skapa projekt-formulär

Uppgifter i projekt

Innehåll i repository
src/app/ – all applikationskod

screenshots/ – skärmdumpar för dokumentation

README.md – denna fil

*.spec.ts – tester för komponenter och tjänster

Licens
MIT – använd fritt i utbildningssyfte.