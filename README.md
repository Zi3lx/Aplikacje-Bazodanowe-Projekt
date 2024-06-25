# Projekt Node.js z wykorzystaniem Express.js

## Na 50 punktów:

Projekt utworzony w Node.js z wykorzystaniem frameworka Express.js. - **JEST**

Użycie relacyjnej bazy danych (np. MySQL, PostgreSQL) z narzędziem Knex.js lub bazy MongoDB z narzędziem Mongoose.js. - **JEST**
- MySQL

Aplikacja posiada co najmniej trzy tabele/kolekcje w bazie danych. - **JEST**
- Tabele: users, products, orders, cart_items, order_items

Implementacja operacji CRUD (Create, Read, Update, Delete) dla wszystkich tabel/kolekcji. - **JEST**
- Dla users, products, cart_items, orders

Interfejs API do operacji CRUD (RESTful endpoints) z możliwością filtrowania, sortowania i paginacji wyników. - **JEST**
- Filtrowanie użytkowników przez admina
- Sortowanie produktów 
- Paginacja produktów (max 10)

Implementacja bardziej złożonych relacji/referencji (np. relacje jeden do wielu). - **JEST**
- Jeden użytkownik może zamówić wiele przedmiotów 

Walidacja danych wejściowych z zaawansowanymi regułami (np. unikalność emaila, minimalna długość hasła) na poziomie modelu z użyciem Knex.js/Mongoose.js. - **JEST**
- Unikalność emaila
- Hasło ma minimalną długość znaków 

Middleware do logowania zapytań HTTP oraz zaawansowanej obsługi błędów. - **JEST**
- Sprawdza admina czy zalogowany i sprawdza hasło 

Zaawansowane użycie języka szablonów EJS do renderowania dynamicznych widoków. - **JEST**

Implementacja asynchronicznych operacji z użyciem async/await w JavaScript. - **JEST**

Implementacja ról użytkowników (np. administrator, użytkownik) z różnicowaniem dostępu do zasobów na podstawie ról. - **JEST**
- Role: admin, customer

Implementacja testów jednostkowych dla co najmniej jednego modelu z wykorzystaniem narzędzi takich jak Mocha, Chai lub Jest. - **JEST**
- Zapis do bazy
- Logowanie
- Aktualizacja
- Usuwanie 
- Pobranie wszystkich użytkowników

Implementacja elementów programowania funkcyjnego w kodzie aplikacji (np. użycie funkcji wyższego rzędu). - **JEST**
- Mapowanie itemów do ordera

## URUCHOMIENIE PROJEKTU

By działało trzeba mieć:
- Działający serwer MySQL i bazę danych MySQL 
- Skonfigurowany plik `.env` 
- Następnie uruchomić Knexa i wrzucić dane oraz schematy tabel:
  npx knex migrate:latest
  npx knex seed:run

- Uruchomić serwer aplikacji poleceniem: 
  npm run dev

- Wejść na `localhost:3000` w przeglądarce internetowej

### Konfiguracja pliku `.env`

Upewnij się, że masz skonfigurowany plik `.env` w katalogu głównym projektu. Plik ten powinien zawierać następujące zmienne środowiskowe:

DB_HOST=localhost  
DB_PORT=3306    
DB_USER=twoja_nazwa_uzytkownika  
DB_PASS=twoje_haslo  
DB_NAME=nazwa_twojej_bazy_danych  

### Uruchomienie testów jednostkowych

Aby uruchomić testy jednostkowe, użyj następującego polecenia:

npm test

### Dodatkowe informacje

- Jeśli napotkasz problemy z migracjami lub seedami, upewnij się, że baza danych jest poprawnie skonfigurowana i dostępna.
- Przed uruchomieniem serwera aplikacji upewnij się, że wszystkie zależności zostały zainstalowane. Możesz to zrobić, uruchamiając:

npm install
