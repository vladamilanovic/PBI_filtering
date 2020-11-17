## Environment

It is needed to configure `.env` file.

```
REACT_APP_ACCESS_TOKEN=
REACT_APP_EMBED_URL=
REACT_APP_EMBED_ID=
```

> REACT_APP_EMBED_ID is just report id

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## SlicerType

|                    | List | Dropdown |
| ------------------ | ---- | -------- |
| Single             | 1    | 4        |
| Multi              | 2    | 5        |
| Multi _Select All_ | 3    | 6        |

The `Selection controls` property is not supported right now, so we use `border radius` to check slicer type.

## Slicer Order

It is needed to set `title` as the order

## Page Navigation Button

It is needed to set `title` like below
`{Page Name}@@{Button Name}@@{order}`

> ex: `Sales Performance@@Performance@@4`
