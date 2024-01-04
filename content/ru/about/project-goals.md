---
name: Цели проекта
permalink: '/about/project-goals'
description: 'Узнайте больше о целях проекта Preact'
---

# Цели проекта Preact

## Цели

Preact стремится достичь нескольких ключевых целей:

- **Производительность**: быстрая и эффективная визуализация.
- **Размер:** Маленький, лёгкий _(около 3,5 КБ)_
- **Эффективность:** Эффективное использование памяти _(избегание перегрузки GC)_
- **Понятность.** Понимание кодовой базы должно занять не более нескольких часов.
- **Совместимость.** Preact стремится быть _в значительной степени совместимым_ с React API. [preact/compat] пытается добиться максимальной совместимости с React.

## Нецели

Некоторые функции React намеренно исключены из Preact либо потому, что они недостижимы при достижении основных целей проекта, перечисленных выше, либо потому, что они не вписываются в объём основного набора функций Preact.

Намеренные различия перечислены в статье [Отличия от React](/guide/v10/differences-to-react):

- `PropTypes`, которые легко использовать как отдельную библиотеку
- `Children`, можно заменить собственными массивами
- `Synthetic Events`, поскольку Preact не пытается исправлять проблемы в старых браузерах, таких как IE8.

[preact/compat]: /guide/v10/switching-to-preact