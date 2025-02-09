import { useEffect, useState } from 'react'

const apiUrl = "https://script.google.com/macros/s/AKfycbxJfXYj8WicckSBdQP-dQRbA7b89UXj7JWxbbDlZixY_Rvw9roCN8VTJXndqtnPcTDZWg/exec";


type GitftlistItem = {
  name: string,
  link: string,
  reservedBy: string,
  changing?: boolean,
}

const User = {
  name: '',
}

function App() {
  const [updating, setUpdating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [giftList, setGiftlist] = useState<GitftlistItem[]>([])

  
  useEffect(
    () => {
      if (!loading) { return }
      fetch(apiUrl).then(result => {
        setLoading(false)
        result.json().then(setGiftlist)
      })
    },
    [loading]
  )

  const ensureUser = () => {
    let username = User.name
    if (!username) {
      username = prompt("What's your name?") || ''
      User.name = username
    }
    return User
  }

  const onGiftlistItemAction = (item:GitftlistItem) => {
    item.changing = true
    setUpdating(true)
  }

  const onGiftlistItemActionResult = () => {
    setUpdating(false)
    setLoading(true)
  }

  const availableitems = giftList.filter(item => !item.reservedBy)
  const reserveditems = giftList.filter(item => item.reservedBy && item.reservedBy !== User.name)
  const myitems = giftList.filter(item => item.reservedBy && item.reservedBy === User.name)

  return (
    <>
    <section id="heroInvitation">
      <div className='introInvitation'>
      <h1>Isadora Onederland! 👶🏻🎉</h1>
      <h2>One year of cuddles, giggles, and milestones, and now it’s time to celebrate!</h2>
      <h3>We’d love for you to join us and make her first birthday even more special ✨</h3>
      </div>
      <ul id="partyInfo">
        <li className="partyDate">
          <Blob color="#FAD2E1" />
          <div className='blobContent'>
            <h3>Date</h3>
            <p>May 25 2025</p>
          </div>
        </li>
        <li className="partyTime">
          <Blob color="#B5EAD7" />
          <div className='blobContent'>
            <h3>Time</h3>
            <p>From 3pm to 6pm</p>
          </div>
        </li>
        <li className="partyLocation">
          <Blob color="#C5CBE3" />
          <div className='blobContent'>
            <h3>Location</h3>
            <p>Our house</p>
          </div>
        </li>
      </ul>

    </section>
    <section id='giftList'>
      <h2>List of gift suggestions</h2>
      <div className="list-container">
          <div className="spinner" id="spinner"></div>
          {giftList.length === 0 && <center><progress /></center>}

          {myitems.length > 0 && <>
            <h3>Your Items</h3>
            <ul className="list-items">
              {myitems.map(item => <>
                  <GiftlistItemListItem
                    item={item}
                    ensureUser={ensureUser}
                    onPosting={onGiftlistItemAction}
                    onResult={onGiftlistItemActionResult}
                  />
                </>)}
            </ul>
          </>}
          {availableitems.length > 0 && <>
            <h3>Items in search of a home</h3>
            <ul className="list-items">
              {availableitems.map(item => <>
                <GiftlistItemListItem
                  item={item}
                  ensureUser={ensureUser}
                  onPosting={onGiftlistItemAction}
                  onResult={onGiftlistItemActionResult}
                />
              </>)}
            </ul>
          </>}
          {reserveditems.length > 0 && <>
            <h3>Items from other peoples</h3>
            <ul className="list-items">
              {reserveditems.map(item => <>
                  <GiftlistItemListItem
                    item={item}
                    ensureUser={ensureUser}
                    onPosting={onGiftlistItemAction}
                    onResult={onGiftlistItemActionResult}
                  />
              </>)}
            </ul>
          </>}
        </div>
    </section>
    </>
  )
}

function GiftlistItemListItem({ item, ensureUser, onPosting, onResult }) {
  const onReserve = (item:GitftlistItem) =>
    () => {
      let userName = ensureUser().name
      onPosting(item)
      fetch(
        `${apiUrl}?action=reserveGift&name=${encodeURIComponent(item.name)}&person=${encodeURIComponent(userName)}`,
        {
          method: 'POST',
        }
      ).then(() => { onResult() }) //setPosting(false); setLoading(true) })
    }

  const onUnreserve = (item:GitftlistItem) =>
    () => {
      onPosting(item)
      fetch(
        `${apiUrl}?action=unreserveGift&name=${encodeURIComponent(item.name)}`,
        {
          method: 'POST',
        }
      ).then(() => { onResult() })
    }
  return <>
    <li className='list-item' key={item.name}>
      <h3>{item.name}</h3>
      <ul className='item-actions'>
        <li className='gift-website'><a href={item.link} target='_blank'>View on website</a></li>
      {
        (User.name && item.reservedBy === User.name && <>
          <li className='gift-reserved'>
            Reserved by you
            <button className="unreserve" onClick={onUnreserve(item)}>
              {item.changing && <progress /> || 'Unreserve'}
            </button>
          </li>
        </>)
        ||
        (item.reservedBy &&  <li className='gift-reserved'>Reserved by someone else</li>)
        ||
        <li className='gift-reserve'>
          <button onClick={onReserve(item)} data-title="Reserve this gift to make sure it's not gifted twice">
            {item.changing && <progress /> || 'Reserve'}
          </button>
          
        </li>
      }
      </ul>
    </li>
  </>
}

export default App


function Blob({ color }: { color: string }) {
  const blobs = [
    "M58,-20.4C64.2,0.6,51,26.3,29.7,42C8.4,57.8,-21,63.6,-39.4,51C-57.8,38.4,-65.2,7.4,-56.8,-16.5C-48.4,-40.3,-24.2,-57.1,0.8,-57.3C25.8,-57.6,51.7,-41.4,58,-20.4Z",
    "M40.7,-9.8C49.1,12.7,49.8,41.1,35.5,52.2C21.3,63.3,-7.9,57.2,-29.8,41.2C-51.8,25.3,-66.5,-0.6,-60.3,-19.9C-54.1,-39.3,-27,-52.3,-5.5,-50.5C16.1,-48.7,32.2,-32.2,40.7,-9.8Z",
    "M64.1,-19.4C70.5,-1.3,54.3,25.5,30.1,43.6C5.9,61.8,-26.3,71.2,-46.1,58.1C-65.8,45,-73.1,9.4,-63.4,-13.3C-53.6,-36,-26.8,-46,1,-46.3C28.9,-46.6,57.8,-37.4,64.1,-19.4Z",
    "M37.4,-44.9C48.4,-35.3,57.3,-23.5,63.4,-8.3C69.6,7,73.1,25.6,65.8,37.8C58.5,50.1,40.5,55.9,24,58.8C7.5,61.6,-7.4,61.5,-22.8,58C-38.2,54.4,-54.1,47.4,-59.4,35.6C-64.6,23.8,-59.2,7.2,-55,-8.4C-50.7,-24,-47.6,-38.5,-38.6,-48.4C-29.6,-58.3,-14.8,-63.6,-0.8,-62.7C13.2,-61.7,26.4,-54.4,37.4,-44.9Z",
    "M49.6,-47.7C65.2,-34,79.4,-17,78.6,-0.7C77.9,15.5,62.2,31,46.6,40.1C31,49.1,15.5,51.7,0.3,51.4C-14.9,51.1,-29.7,47.8,-38.9,38.8C-48.1,29.7,-51.7,14.9,-53.7,-2.1C-55.8,-19,-56.3,-37.9,-47.1,-51.7C-37.9,-65.5,-19,-74.1,-1,-73.1C17,-72.1,34,-61.5,49.6,-47.7Z"
    
  ];

  const rotations = [-10, 0, 10, 20, -20];  
  const randomBlob = blobs[Math.floor(Math.random() * blobs.length)];
  const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="blob"
      style={{ transform: `rotate(${randomRotation}deg)` }}
    >
      <path fill={color} d={randomBlob} transform="translate(100 100)" />
    </svg>
  );
}
