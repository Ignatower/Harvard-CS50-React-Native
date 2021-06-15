const state = {                                                                                            
  id: 'idigna',                                                                                           
  name: 'igna',                                                                              
  location: null,                            
  groups: { NewIdGroup923897274fw: true, '-M_Rgc_jebuspEW0yZb2': true }                      
} 
const state2 = {...state}
const id = '-M_Rgc_jebuspEW0yZb2'
delete state.groups[id]
const newGroup = {...state}