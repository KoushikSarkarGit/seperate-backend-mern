const express = require('express')
const router = express.Router()
const Notesmodel = require('../models/note')
const { body, validationResult } = require('express-validator');
const fetchuserdetails = require('../middlewares/fetchuserdetails');

// route to create a note

router.post('/createnote', fetchuserdetails,
  // Doing validation

  body('Title', 'title length should be at least 3 characters').isLength({ min: 3 }).isString(),
  body('Description', 'description cannot be empty').isLength({ min: 10 }),
  body('Tag', 'minimum password length should be 5').isString(),

  async (req, res) => {

    try {
      // checking if provided data is valid or not
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }



      let { Title, Description, Tag } = req.body

      let newnote = await Notesmodel.create({
        Title,
        Description,
        Tag,
        User: req.id
      })
      let savednote = await newnote.save()

      res.send(savednote);
    } catch (error) {

      console.log(error)
      return res.status(200).json({ error: 'something went wrong' })

    }

  }

)

// route to fetch all note of the logged in user
router.get('/getallnotes', fetchuserdetails,

  async (req, res) => {

    try {
      // Finding All The Notes of the user
      let yournotes = await Notesmodel.find({User: req.id});
      res.status(200).json(yournotes)


    } catch (error) {

      console.log(error)
      return res.status(200).json({ error: 'something went wrong' })

    }

  }

)


// route to update note of the logged in user
router.put('/updatenote/:noteid', fetchuserdetails, 

body('Title', 'title length should be at least 3 characters').isLength({ min: 3 }).isString(),
body('Description', 'description cannot be empty').isLength({ min: 10 }),
body('Tag', 'minimum password length should be 5').isString(),

  async (req, res) => {
    

    try {
      //validating
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {Title, Description, Tag} = req.body;

      let newnote = {}

      if(Title){newnote.Title = Title}
      if(Description){newnote.Description = Description}
      if(Tag){newnote.Tag = Tag}



      //check if the note is valid
      let noteTobeUpdated = await Notesmodel.findById(req.params.noteid)
      if(!noteTobeUpdated){
        return res.status(401).json({ error: 'Not Allowed' })
      }

      if(noteTobeUpdated.User.toString() !== req.id){
        return res.status(401).json({ error: 'Not Allowed' })
      }
      
      let updatednote = await Notesmodel.findByIdAndUpdate(req.params.noteid, {$set: newnote}, {new: true})

      return res.status(200).json(updatednote)


    } catch (error) {

      console.log(error)
      return res.status(401).json({ error: 'something went wrong' })

    }

  }

)


// route to delete note of the logged in user
router.delete('/deletenote/:noteid', fetchuserdetails, 


  async (req, res) => {
    

    try {

      //check if the note is valid
      let noteTobeUpdated = await Notesmodel.findById(req.params.noteid)
      if(!noteTobeUpdated){
        return res.status(401).json({ error: 'Not Allowed' })
      }

      if(noteTobeUpdated.User.toString() !== req.id){
        return res.status(401).json({ error: 'Not Allowed' })
      }
      
      let deletednote = await Notesmodel.findByIdAndDelete(req.params.noteid);

      return res.status(200).json({ msg: 'the following note has been deleted', deletednote})


    } catch (error) {

      console.log(error)
      return res.status(401).json({ error: 'something went wrong' })

    }

  }

)

module.exports = router