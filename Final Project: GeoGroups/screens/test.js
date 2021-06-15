
const groupData = [{key:"coords",value:{"latitude":64.2232,"longitude":63.9901,"radius":8000}},
{key:"members",value:{"uIdIgna":true,"uIdLeonardo":true,"uIdPaul":true}},
{key:"title",value:"cordoba vende!"},
{key:"uriImage",value:"null"}]

const members = Object.keys(groupData[1].value)
const updates = {}
const chatId = "chatId0090"
members.forEach(memberId => updates["/chats/"+ memberId + "/" + chatId] = {lastMessage: "me fui al campo!"})
console.log(updates)