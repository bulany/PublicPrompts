Great questions — France’s territorial administration looks simple at first (“departments have numbers”), but there’s a lot of history and a few different institutions involved. I’ll go step by step and tie it all together.

---

## 1. Who holds the “definitive” list of department numbers?

### Short answer

**INSEE is the authoritative source for department (and region) codes.**
La Poste uses those codes operationally, but does not define them.

### INSEE (Institut national de la statistique et des études économiques)

* France’s national statistics office.
* Responsible for **official geographic codes**, published as the **COG (Code officiel géographique)**.
* The COG defines:

  * Region codes
  * Department codes
  * Commune codes (INSEE codes)
* Used by:

  * The State
  * Courts
  * Tax administration
  * Social security
  * Researchers
  * Software systems

If there is any ambiguity, **INSEE takes precedence**.

### La Poste

* France’s postal service.
* Uses department numbers heavily because:

  * Postal codes are structured as `DDXXX` (DD = department number)
* However:

  * La Poste **follows** INSEE’s department numbering
  * It does **not** define or legislate them
* Occasionally La Poste makes pragmatic choices for mail routing, but this never overrides INSEE’s definitions.

### Do their lists differ?

* **No for departments**: department numbers are the same.
* Minor edge cases:

  * Overseas territories
  * Special postal routing conventions
    But administratively, INSEE’s list is the reference.

---

## 2. Department numbers: why they look the way they do

* Created during the **French Revolution (1790)**
* Originally ordered roughly:

  * **Alphabetically**
  * With some geographic continuity
* Over time:

  * New departments added
  * Some split or merged
  * Corsica split into **2A / 2B**
  * Overseas departments got numbers like **971–976**

That’s why the numbering looks “mostly alphabetical” but not perfectly so.

---

## 3. Who maintains the list of regions?

Again: **INSEE**, via the **COG**.

### Current regions (since 2016)

France has **18 regions**:

* **13 metropolitan regions**
* **5 overseas regions**

### Metropolitan regions

1. Auvergne-Rhône-Alpes
2. Bourgogne-Franche-Comté
3. Bretagne
4. Centre-Val de Loire
5. Corse
6. Grand Est
7. Hauts-de-France
8. Île-de-France
9. Normandie
10. Nouvelle-Aquitaine
11. Occitanie
12. Pays de la Loire
13. Provence-Alpes-Côte d’Azur

### Overseas regions

14. Guadeloupe
15. Martinique
16. Guyane
17. La Réunion
18. Mayotte

Each region also has an **INSEE region code**.

---

## 4. Is there an “official order” for regions?

### Administratively

* Regions have **codes**, not a semantic “order”
* Any listing order depends on context:

  * Alphabetical (very common)
  * Code order (used in data systems)
  * Geographic (maps, education)

So:

> Is “Bretagne” always listed before “Occitanie”?

**No — unless the list is explicitly alphabetical.**
There is no constitutional or legal precedence ordering.

INSEE typically publishes:

* By **code**
* Or alphabetically

---

## 5. The hierarchy: how it all fits together

Here’s the **full territorial hierarchy**, from top to bottom:

```
State (État)
 └── Region (Région)
      └── Department (Département)
           └── Arrondissement
                └── Canton
                     └── Commune
```

Let’s unpack each level.

---

## 6. Regions (Régions)

* Political and administrative level
* Responsibilities include:

  * Economic development
  * Regional transport
  * High schools
  * Regional planning
* Governed by:

  * A **regional council**
  * A **president of the regional council**
* The **State** is represented by:

  * A **regional prefect (préfet de région)**

Regions were strengthened significantly in:

* **1982–83 decentralization laws**
* **2016 reform** (merging regions)

---

## 7. Departments (Départements)

* Older than regions (1790)
* Designed so you could reach the capital in one day on horseback
* Responsibilities include:

  * Social services
  * Middle schools (collèges)
  * Local roads
* Governed by:

  * A **departmental council**
* State representative:

  * **Prefect (préfet)**

Each department has:

* A **number**
* A **name**
* A **prefecture** (chef-lieu)

---

## 8. Prefecture (Préfecture): what is it exactly?

Important distinction:

* **Prefecture** = the **capital city** of a department (or region)
* **Prefect** = the **State’s representative**

So:

* The prefecture is **not a level below department**
* It is the **administrative seat** of the department

Every department has:

* 1 prefecture
* Several **subprefectures**

---

## 9. Below the department

### Arrondissements

* Administrative subdivisions of departments
* Headed by a **subprefect**
* Mainly used for:

  * State administration
  * Coordination of services
* No elected council

### Cantons

* Electoral districts
* Used to elect members of departmental councils
* Not really administrative units anymore

### Communes

* Smallest unit
* Can be:

  * A village
  * A major city (Paris, Marseille, Lyon are special cases)
* Governed by:

  * A **mayor**
  * A **municipal council**
* Each commune has:

  * An **INSEE code**
  * A name
* There are ~35,000 communes (many very small)

---

## 10. Above regions?

There is **nothing above regions** territorially inside France.

But:

* The **State (État)** is unitary
* Regions do **not** have sovereignty
* Prefects represent the State at each level

So France is:

* **Decentralized**
* But **not federal**

---

## 11. A bit of history (why it’s like this)

### 1789–1790

* Abolition of provinces (Brittany, Burgundy, etc.)
* Creation of departments to:

  * Break feudal power
  * Create equality
  * Simplify administration

### 19th–20th century

* Departments dominate administration
* Strong central State

### 1980s

* Decentralization laws
* Regions become real political entities

### 2016

* Regions merged for efficiency
* Departments kept (they are deeply embedded)

---

## 12. Putting it all together

* **INSEE** defines the official geographic structure and codes
* **La Poste** uses them operationally
* **Regions** and **departments** are political entities
* **Prefects** represent the State at each level
* The system balances:

  * Revolutionary egalitarian ideals
  * Strong central administration
  * Gradual decentralization

If you want, I can also:

* Map this to postal codes
* Explain special cases (Paris, Lyon, Marseille)
* Show how this looks in datasets / APIs
* Compare it to another country’s system

Just tell me 🙂
