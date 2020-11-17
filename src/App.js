import React, { useState } from 'react'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import { makeStyles } from '@material-ui/core/styles'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import './App.scss'

import { models } from 'powerbi-client'
import 'powerbi-report-authoring'
import { Report } from 'powerbi-report-component'

import ListSingle from './components/ListSingle'
import ListMulti from './components/ListMulti'
import ListMultiAll from './components/ListMultiAll'
import DropMultiAll from './components/DropMultiAll'
import clsx from 'clsx'
import DropMulti from './components/DropMulti'
import DropSingle from './components/DropSingle'

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: theme.spacing(4),
    minWidth: '100%',
  },
  sshr: {
    marginTop: 10,
    marginBottom: 20,
    width: '100%',
    height: 1,
    background: '#bbb',
  },
  active: {
    color: '#fff',
    background: theme.palette.primary.main,
    '&:hover': {
      background: theme.palette.primary.dark,
    },
  },
}))

const SlicerType = {
  LIST_SINGLE: 1,
  LIST_MULTI: 2,
  LIST_MULTI_ALL: 3,
  DROP_SINGLE: 4,
  DROP_MULTI: 5,
  DROP_MULTI_ALL: 6,
}

function App() {
  const classes = useStyles()
  const [report, setReport] = useState()

  const [curBookmark, setCurBookmark] = useState('')
  const [bookmarks, setBookmarks] = useState([])
  // apply selected bookmark to powerbi report
  const handleChangeBookmark = (e) => {
    setCurBookmark(e.target.value)
    try {
      report.bookmarksManager.apply(e.target.value)
    } catch (err) {
      console.log('apply bookmark error:', err)
    }
  }

  const [state, setState] = useState({
    listSingle: [],
    listMulti: [],
    listMultiAll: [],
    dropSingle: [],
    dropMulti: [],
    dropMultiAll: [],
  })

  const handleChangeSlicer = (type, slicerName) => (e) => {
    // console.log('handlechangeslicer:', type, slicerName, e.target.value, e.target.name, e.target.checked)
    let basicFilter
    const sData = state[type].filter((el) => Object.keys(el)[0] === slicerName)[0]

    basicFilter = {
      $schema: 'http://powerbi.com/product/schema#basic',
      target: {
        table: sData[slicerName].table,
        column: sData[slicerName].column,
      },
      operator: 'In',
      values: [e.target.value],
      // filterType: models.FilterType.BasicFilter,
      filterType: 1,
    }
    if (type === 'listSingle' || type === 'dropSingle') {
      // console.log('basicFilter:', basicFilter)

      const updatedData = state[type].map((el) =>
        Object.keys(el)[0] === slicerName
          ? {
              [slicerName]: {
                table: sData[slicerName].table,
                column: sData[slicerName].column,
                curValue: e.target.value,
                valueLists: sData[slicerName].valueLists,
                order: sData[slicerName].order,
              },
            }
          : el
      )
      if (type === 'listSingle') {
        setState((curState) => ({
          ...curState,
          listSingle: updatedData,
        }))
      } else {
        setState((curState) => ({
          ...curState,
          dropSingle: updatedData,
        }))
      }
    } else if (type === 'listMulti' || type === 'dropMulti') {
      const updatedValueLists = sData[slicerName].valueLists.map(({ checked, label }) =>
        label === e.target.name ? { label, checked: e.target.checked } : { label, checked }
      )
      const updatedCurValues = updatedValueLists
        .filter(({ label, checked }) => checked)
        .map(({ label, checked }) => label)

      if (updatedCurValues.length > 0) {
        basicFilter.values = updatedCurValues
      } else {
        basicFilter = 'empty'
      }

      const updatedData = state[type].map((el) =>
        Object.keys(el)[0] === slicerName
          ? {
              [slicerName]: {
                table: sData[slicerName].table,
                column: sData[slicerName].column,
                curValue: updatedCurValues,
                valueLists: updatedValueLists,
                order: sData[slicerName].order,
              },
            }
          : el
      )
      if (type === 'listMulti') {
        setState((curState) => ({
          ...curState,
          listMulti: updatedData,
        }))
      } else {
        setState((curState) => ({
          ...curState,
          dropMulti: updatedData,
        }))
      }
    } else if (type === 'listMultiAll' || type === 'dropMultiAll') {
      let updatedValueLists, updatedCurValues, updatedData
      if (e.target.name === 'Select All') {
        updatedValueLists = sData[slicerName].valueLists.map(({ checked, label }) => ({
          label,
          checked: e.target.checked,
        }))
        if (e.target.checked) {
          updatedCurValues = updatedValueLists.map(({ label, checked }) => label)
        } else {
          updatedCurValues = []
        }
        basicFilter = 'empty'
      } else {
        updatedValueLists = sData[slicerName].valueLists.map(({ checked, label }) =>
          label === e.target.name ? { label, checked: e.target.checked } : { label, checked }
        )
        updatedCurValues = updatedValueLists.filter(({ label, checked }) => checked).map(({ label, checked }) => label)

        if (updatedCurValues.length === 0) {
          // every options except for 'Select All' are disselected
          basicFilter = 'empty'
        } else if (updatedCurValues.length === updatedValueLists.length - 1) {
          if (e.target.checked) {
            // every options except for 'Select All' are selected
            updatedValueLists[0].checked = true // 'Select All' true
            updatedCurValues = updatedCurValues.unshift('Select All')
            basicFilter = 'empty'
          } else {
            updatedValueLists[0].checked = false // 'Select All' false
            updatedCurValues = updatedCurValues.slice(1)
            basicFilter.values = updatedCurValues
          }
        } else {
          basicFilter.values = updatedCurValues
        }
      }
      updatedData = state[type].map((el) =>
        Object.keys(el)[0] === slicerName
          ? {
              [slicerName]: {
                table: sData[slicerName].table,
                column: sData[slicerName].column,
                curValue: updatedCurValues,
                valueLists: updatedValueLists,
                order: sData[slicerName].order,
              },
            }
          : el
      )

      if (type === 'listMultiAll') {
        setState((curState) => ({
          ...curState,
          listMultiAll: updatedData,
        }))
      } else {
        setState((curState) => ({
          ...curState,
          dropMultiAll: updatedData,
        }))
      }
    }

    // if nothing is selected, set just empty array
    // basicFilter = 'empty'
    // Retrieve the page collection and get the visuals for the first page.
    report
      .getPages()
      .then(function (pages) {
        // Retrieve active page.
        var activePage = pages.filter(function (page) {
          return page.isActive
        })[0]

        activePage
          .getVisuals()
          .then(function (visuals) {
            // Retrieve the target slicer.
            let slicer = visuals.filter(function (visual) {
              return visual.type === 'slicer' && visual.name === slicerName
            })[0]

            // Set the slicer state which contains the slicer filters.
            if (basicFilter === 'empty') {
              slicer
                .setSlicerState({ filters: [] })
                .then(function () {
                  console.log('slicer was set.')
                })
                .catch(function (errors) {
                  console.log(errors)
                })
            } else {
              slicer
                .setSlicerState({ filters: [basicFilter] })
                .then(function () {
                  console.log('slicer was set.')
                })
                .catch(function (errors) {
                  console.log(errors)
                })
            }
          })
          .catch(function (errors) {
            console.log(errors)
          })
      })
      .catch(function (errors) {
        console.log(errors)
      })
  }

  // page navigation
  const [pages, setPages] = useState([])
  const [navButtons, setNavButtons] = useState([])
  const [curPage, setCurPage] = useState('') // save display name of the current page
  const handleNav = (pageDName) => {
    if (pageDName && pages) {
      const pageObj = pages.filter((el) => el.dName === pageDName)
      const pageInstance = report.page(pageObj[0].name)
      pageInstance.setActive()
    }
  }

  const header = (
    <div className="header">
      <div className="title">
        React <b>Filtering</b> and <b>Navigation</b> Through Embedded Powerbi Reports DEMO
      </div>
    </div>
  )

  const reportStyle = {
    // style object for report component
  }

  const extraSettings = {
    filterPaneEnabled: false,
    navContentPaneEnabled: false,
    hideErrors: false, // Use this *only* when you want to override error experience i.e, use onError
    // ... more custom settings
  }

  const handleDataSelected = (data) => {
    // will be called when some chart or data element in your report clicked
  }

  const handleReportLoad = (report) => {
    // will be called when report loads:
    // - scripts and data received from server, visuals are rendered on the browser
    // - flickering Power BI logo stops appearing but report is not fully ready to be consumed

    setReport(report) // get the report object from callback and store it.(optional)

    // get bookmarks
    report.bookmarksManager.getBookmarks().then(function (bks) {
      // console.log('bookmarks:', bks[0])
      setBookmarks(bks)
      setCurBookmark(bks[0]?.name)
    })

    // get pages
    report.getPages().then(function (pages) {
      // console.log('pages:', pages)
      const arrPages = pages.map((page, index) => ({
        index,
        name: page.name,
        dName: page.displayName,
      }))
      setPages(arrPages)
    })
  }

  const handleReportRender = (report) => {
    // will be called when report renders:
    // - visuals finish rendering
    // - report is fully visible and ready for consumption
  }

  const handlePageChange = (data) => {
    // will be called when pages in your report changes

    // initialize state
    setState({
      listSingle: [],
      listMulti: [],
      listMultiAll: [],
      dropSingle: [],
      dropMulti: [],
      dropMultiAll: [],
    })
    setNavButtons([])

    let activePage = data.newPage
    setCurPage(activePage.displayName)

    activePage
      .getVisuals()
      .then(async function (visuals) {
        let navigationButtons = visuals.filter((visual) => visual.type === 'actionButton')
        let navButtonsArr = []
        for (let ii = 0; ii < navigationButtons.length; ii++) {
          const el = navigationButtons[ii]
          try {
            const result = await el.getProperty({
              objectName: 'title',
              propertyName: 'titleText',
            })
            const navTitle = result?.value
            if (navTitle && navTitle.includes('@@')) {
              const infoArr = navTitle.split('@@')
              navButtonsArr.push({
                name: infoArr[1],
                pageDName: infoArr[0],
                order: infoArr[2],
              })
            }
          } catch (err) {
            console.log('navigation get title catch:', err)
          }
        }
        setNavButtons(navButtonsArr)

        var slicers = visuals.filter((visual) => visual.type === 'slicer')

        if (slicers.length > 0) {
          for (const slicer of slicers) {
            // get slicer *border radius* property
            let borderRadius = SlicerType.LIST_MULTI
            let slicerOrder = 1
            try {
              const result = await slicer.getProperty({
                objectName: 'border',
                propertyName: 'radius',
              })
              borderRadius = result?.value
              // console.log('border-radius:', borderRadius)
              const titleProperty = await slicer.getProperty({
                objectName: 'title',
                propertyName: 'titleText',
              })
              slicerOrder = titleProperty?.value
              // console.log('slicer-order:', slicerOrder)
            } catch (err) {
              console.log('get property(border-radius & title) catch:', err)
            }

            // get summarized data of slicer
            const result = await slicer.exportData(models.ExportDataType.Summarized)
            // console.log('result=====summarized:', JSON.stringify(result))
            // exclude first element, and empty string, (first element is column name)
            let sliceOptions = result.data.split('\r\n').filter((el, i) => i !== 0 && el)

            // get slicer state
            const st = await slicer.getSlicerState()
            // console.log('slicer:============:state', st)
            let curSelectedValues = st.filters[0]?.values || []
            let addedValueLists

            switch (borderRadius) {
              case SlicerType.LIST_SINGLE:
                setState((curState) => ({
                  ...curState,
                  listSingle: [
                    ...curState.listSingle,
                    {
                      [slicer.name]: {
                        table: st.targets[0].table,
                        column: st.targets[0].column,
                        curValue: st.filters[0]?.values[0],
                        valueLists: sliceOptions,
                        order: slicerOrder,
                      },
                    },
                  ],
                }))
                break
              case SlicerType.DROP_SINGLE:
                setState((curState) => ({
                  ...curState,
                  dropSingle: [
                    ...curState.dropSingle,
                    {
                      [slicer.name]: {
                        table: st.targets[0].table,
                        column: st.targets[0].column,
                        curValue: st.filters[0]?.values[0],
                        valueLists: sliceOptions,
                        order: slicerOrder,
                      },
                    },
                  ],
                }))
                break
              case SlicerType.LIST_MULTI_ALL:
                addedValueLists = sliceOptions.map((el) => ({
                  label: el,
                  checked: curSelectedValues.includes(el) ? true : false,
                }))
                addedValueLists.unshift({ label: 'Select All', checked: false })

                setState((curState) => ({
                  ...curState,
                  listMultiAll: [
                    ...curState.listMultiAll,
                    {
                      [slicer.name]: {
                        table: st.targets[0].table,
                        column: st.targets[0].column,
                        curValue: curSelectedValues,
                        valueLists: addedValueLists,
                        order: slicerOrder,
                      },
                    },
                  ],
                }))
                break
              case SlicerType.DROP_MULTI_ALL:
                addedValueLists = sliceOptions.map((el) => ({
                  label: el,
                  checked: curSelectedValues.includes(el) ? true : false,
                }))
                addedValueLists.unshift({ label: 'Select All', checked: false })

                setState((curState) => ({
                  ...curState,
                  dropMultiAll: [
                    ...curState.dropMultiAll,
                    {
                      [slicer.name]: {
                        table: st.targets[0].table,
                        column: st.targets[0].column,
                        curValue: curSelectedValues,
                        valueLists: addedValueLists,
                        order: slicerOrder,
                      },
                    },
                  ],
                }))
                break
              case SlicerType.DROP_MULTI:
                setState((curState) => ({
                  ...curState,
                  dropMulti: [
                    ...curState.dropMulti,
                    {
                      [slicer.name]: {
                        order: slicerOrder,
                        table: st.targets[0].table,
                        column: st.targets[0].column,
                        curValue: curSelectedValues,
                        valueLists: sliceOptions.map((el) => ({
                          label: el,
                          checked: curSelectedValues.includes(el) ? true : false,
                        })),
                      },
                    },
                  ],
                }))
                break
              default:
                // SlicerType.LIST_MULTI
                setState((curState) => ({
                  ...curState,
                  listMulti: [
                    ...curState.listMulti,
                    {
                      [slicer.name]: {
                        order: slicerOrder,
                        table: st.targets[0].table,
                        column: st.targets[0].column,
                        curValue: curSelectedValues,
                        valueLists: sliceOptions.map((el) => ({
                          label: el,
                          checked: curSelectedValues.includes(el) ? true : false,
                        })),
                      },
                    },
                  ],
                }))
            }
          }
        }
      })
      .catch((err) => console.log('get Visual catch:', err))
  }

  // console.log('=================state ========> ', state)
  // console.log('curpage:', curPage)
  // console.log('navButtons:', navButtons)
  // console.log('pages:', pages)
  return (
    <div>
      {header}

      <div className="content">
        <aside>
          <FormControl component="fieldset">
            <FormLabel component="legend">Bookmarks</FormLabel>
            <RadioGroup aria-label="bookmarks" name="bookmarks" value={curBookmark} onChange={handleChangeBookmark}>
              {bookmarks.map((bookmark, index) => (
                <FormControlLabel value={bookmark.name} control={<Radio />} label={bookmark.displayName} key={index} />
              ))}
            </RadioGroup>
          </FormControl>

          <div className={classes.sshr}></div>

          <div className="slicers-div">
            {state.listSingle.map((el, idx) => (
              <ListSingle data={el} key={idx} onChangeCallback={handleChangeSlicer} />
            ))}
            {state.listMulti.map((el, idx) => (
              <ListMulti data={el} key={idx} onChangeCallback={handleChangeSlicer} />
            ))}
            {state.listMultiAll.map((el, idx) => (
              <ListMultiAll data={el} key={idx} onChangeCallback={handleChangeSlicer} />
            ))}
            {state.dropMultiAll.map((el, idx) => (
              <DropMultiAll data={el} key={idx} onChangeCallback={handleChangeSlicer} />
            ))}
            {state.dropMulti.map((el, idx) => (
              <DropMulti data={el} key={idx} onChangeCallback={handleChangeSlicer} />
            ))}
            {state.dropSingle.map((el, idx) => (
              <DropSingle data={el} key={idx} onChangeCallback={handleChangeSlicer} />
            ))}
          </div>
        </aside>

        <section>
          {pages.length > 0 && (
            <div className="page-div">
              <ButtonGroup color="primary" aria-label="outlined primary button group">
                {navButtons
                  .sort((a, b) => parseInt(a.order) - parseInt(b.order))
                  .map((el, index) => (
                    <Button
                      key={index}
                      className={clsx(curPage === el.pageDName && classes.active)}
                      onClick={() => handleNav(el.pageDName)}
                    >
                      {el.name}
                    </Button>
                  ))}
              </ButtonGroup>
            </div>
          )}
          <div className="report-style-class">
            <Report
              tokenType="Embed" // "Aad"
              accessToken={process.env.REACT_APP_ACCESS_TOKEN}
              embedUrl={process.env.REACT_APP_EMBED_URL}
              embedId={process.env.REACT_APP_EMBED_ID} // report or dashboard Id goes here
              pageName="" // set as current page of the report
              reportMode="View" // open report in a particular mode View/Edit/Create
              // datasetId={datasetId} // required for reportMode = "Create" and optional for dynamic databinding in `report` on `View` mode
              // groupId="" // optional. Used when reportMode = "Create" and to chose the target workspace when the dataset is shared.
              // groupId="" // optional. Used when reportMode = "Create" and to chose the target workspace when the dataset is shared.
              extraSettings={extraSettings}
              permissions="All" // View, For "Edit" mode permissions should be "All"
              style={reportStyle}
              onLoad={handleReportLoad}
              onRender={handleReportRender} // not allowed in "Create" mode
              onSelectData={handleDataSelected}
              onPageChange={handlePageChange}
              // onSave={handleReportSave} // works for "Edit" and "Create"
            />
          </div>
        </section>
      </div>

      <div className="hr"></div>
    </div>
  )
}

export default App
