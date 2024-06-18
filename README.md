Na 50 punktów:

Projekt utworzony w Node.js z wykorzystaniem frameworka Express.js. - JEST
Użycie relacyjnej bazy danych (np. MySQL, PostgreSQL) z narzędziem Knex.js lub bazy MongoDB z narzędziem Mongoose.js. - JEST 
    - MySQL
Aplikacja posiada co najmniej trzy tabele/kolekcje w bazie danych. - JEST
    - Tabele: users, products, orders, cart_items, order_items
Implementacja operacji CRUD (Create, Read, Update, Delete) dla wszystkich tabel/kolekcji. - JEST
    - Dla users, products, cart_items, orders
Interfejs API do operacji CRUD (RESTful endpoints) z możliwością filtrowania, sortowania i paginacji wyników. JEST -
    - filtrowanie uzytkownikow przez admina
    - sortowanie produktów 
    - paginacja produktów max 10
Implementacja bardziej złożonych relacji/referencji (np. relacje jeden do wielu). - JEST
    - Jeden uytkownik moze zamowic wiele przedmiotow 
Walidacja danych wejściowych z zaawansowanymi regułami (np. unikalność emaila, minimalna długość hasła) na poziomie modelu z użyciem Knex.js/Mongoose.js. - JEST
    - unikalnosc emaila
    - haslo ma minimalna dlugosc znakow 
Middleware do logowania zapytań HTTP oraz zaawansowanej obsługi błędów. - JEST
    - sprawdza admina czy zalogowany i sprawdza hasło 
Zaawansowane użycie języka szablonów EJS do renderowania dynamicznych widoków. - JEST
Implementacja asynchronicznych operacji z użyciem async/await w JavaScript. - JEST
Implementacja ról użytkowników (np. administrator, użytkownik) z różnicowaniem dostępu do zasobów na podstawie ról. - JEST
    - admin
    - customer
Implementacja testów jednostkowych dla co najmniej jednego modelu z wykorzystaniem narzędzi takich jak Mocha, Chai lub Jest. - JEST
    - zapis do bazy
    - logowanie
    - aktualizacja
    - usuwanie 
    - wziecie wszytkich uzytkownikow
Implementacja elementów programowania funkcyjnego w kodzie aplikacji (np. użycie funkcji wyższego rzędu). - JEST
    - mapowanie itemow do ordera


URUCHOMIENIE PROJEKTU

By działało trzeba miec:
    - dzialajacy serwer mysql i bazedanych mysql 
    - skonfigurowany plik .env 
    - nastepnie uruchomic knexa i wrzucic dane jak i schematy tabel
        npx knex migrate:latest
        npx knex seed:run
    - uruchomic poleceniem: 
        npm run dev
    - wejsc na localhost:3000
    - by uruchomic testy jednostkowe 
        npm test