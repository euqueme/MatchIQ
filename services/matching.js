// Matching service: sample users and matching rules
export const sampleUsers = [
  {id:0, name:'Alex', age:24, iq:90, attr:3, dist:12, bio:'Loves hiking and coffee.'},
  {id:1, name:'Sam', age:29, iq:95, attr:4, dist:5, bio:'Enjoys reading and music.'},
  {id:2, name:'Jordan', age:31, iq:100, attr:6, dist:40, bio:'Tech enthusiast and cook.'},
  {id:3, name:'Taylor', age:27, iq:105, attr:7, dist:200, bio:'Artist and traveler.'},
  {id:4, name:'Riley', age:22, iq:110, attr:8, dist:10, bio:'Student, loves cats.'},
  {id:5, name:'Casey', age:35, iq:115, attr:9, dist:150, bio:'Runner and reader.'},
  {id:6, name:'Morgan', age:28, iq:120, attr:5, dist:30, bio:'Musician and photographer.'},
  {id:7, name:'Jamie', age:40, iq:125, attr:6, dist:400, bio:'Enjoys gardening.'},
  {id:8, name:'Avery', age:33, iq:130, attr:10, dist:8, bio:'Chef and foodie.'},
  {id:9, name:'Cameron', age:26, iq:85, attr:2, dist:80, bio:'Gamer and streamer.'},
  {id:10, name:'Quinn', age:38, iq:140, attr:7, dist:1200, bio:'World traveler.'},
  {id:11, name:'Drew', age:21, iq:98, attr:4, dist:3, bio:'Student and cyclist.'},
  {id:12, name:'Blake', age:45, iq:108, attr:5, dist:60, bio:'Carpenter and maker.'},
  {id:13, name:'Hayden', age:30, iq:112, attr:6, dist:25, bio:'Coffee lover.'},
  {id:14, name:'Parker', age:23, iq:102, attr:5, dist:18, bio:'Food truck fan.'},
  {id:15, name:'Reese', age:36, iq:118, attr:8, dist:90, bio:'Hiker and parent.'},
  {id:16, name:'Rowan', age:42, iq:88, attr:3, dist:500, bio:'Mechanic.'},
  {id:17, name:'Kai', age:34, iq:107, attr:6, dist:75, bio:'Teacher.'},
  {id:18, name:'Noel', age:25, iq:99, attr:5, dist:22, bio:'Designer.'},
  {id:19, name:'Sky', age:32, iq:121, attr:9, dist:14, bio:'Entrepreneur.'},
  {id:20, name:'Shawn', age:37, iq:93, attr:2, dist:350, bio:'Photographer.'},
  {id:21, name:'Lee', age:28, iq:104, attr:6, dist:45, bio:'Engineer.'},
  {id:22, name:'Eden', age:26, iq:117, attr:8, dist:9, bio:'Sculptor.'},
  {id:23, name:'Finn', age:39, iq:86, attr:1, dist:600, bio:'Truck driver.'},
  {id:24, name:'Blair', age:41, iq:132, attr:9, dist:20, bio:'Lawyer.'},
  {id:25, name:'Toby', age:20, iq:91, attr:3, dist:2, bio:'Student.'},
  {id:26, name:'Mika', age:29, iq:109, attr:7, dist:66, bio:'Developer.'},
  {id:27, name:'Remy', age:31, iq:116, attr:8, dist:33, bio:'Nurse.'},
  {id:28, name:'Sage', age:27, iq:101, attr:5, dist:11, bio:'Barista.'},
  {id:29, name:'Ari', age:35, iq:124, attr:10, dist:7, bio:'Designer.'},
];

export function findMatches(usersList, iq, attr, filters) {
  const { ageMin, ageMax, maxDist } = filters;
  return usersList.filter(u => {
    return u.iq >= iq-5 && u.iq <= iq+5 && u.attr >= attr-1 && u.attr <= attr+1 && u.age >= ageMin && u.age <= ageMax && u.dist <= maxDist;
  });
}
