- Service Worker
- web.manifest
- .webm files
- xstate, rxjs on client

```
homepage
    - Masonry List | Load More with htmx
    - Overflow Icon
    - Tappable
GET Index \
GET Show(id) \notes\{id}
GET Edit(id) \notes\{id}\edit
GET New \notes\create
POST Create \notes
PUT Update \notes\{id}
DELETE Delete \notes\{id}
```

<div hx-get={handleOnClick} />
<div hx-post={handleOnClick} />

Receive Query
Generate HTML payload following htmx specification adding behavior

- strike
- toggle
- rearrange
- tap
- longpress
- fling
