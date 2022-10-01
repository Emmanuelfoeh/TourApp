const { catchAsync } = require('../utils/catchAsync');
const Tour = require('./../Models/tourModel')
const APIFeatures = require('./../utils/apiFeatures')


 exports.getAllTours = catchAsync( async (req, res,next) => {
  
    const features = new APIFeatures(Tour.find(),req.query).filter().sort().limitFields().paginate() 
    const tours = await features.query

     res.status(200).json({
    status: 'success',
    data_length: tours.length,
    data: {
      tours,
    },
  });
  
  // catch (error) {
  //   res.status(404).json({
  //     status:'fail',
  //     message: error
  //   })
    
  // }

 
});

 exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
     res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
    
  }
 
};

 exports.updateTour = async (req, res) => {
  try {

    const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true
    })
     res.status(200).json({
      status:'success',
     data:{tour}
   });
  } catch (error) {
     res.status(404).json({
       status: 'fail',
       message: error,
     });
    
  }
  
 };
 exports.deleteTour = async (req, res) => {
   try {
     const tour = await Tour.findByIdAndDelete(req.params.id);
     res.status(204).json({
       status: 'success',
     });
   } catch (error) {
     res.status(404).json({
       status: 'fail',
       message: error,
     });
   }
 };

// const catchAsync = fn=>{
//   return (req,res,next)=>{
//     fn(req,res,next).catch(next)
//   }
// }


exports.addTour = catchAsync (async (req, res) => {
  
   const newTour = await Tour.create(req.body)
    res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });

  // try {
   

  // } 
  // catch (error) {
  //   res.status(400).json({
  //     status: "fail",
  //     message: error
  //   })
    
  // }
      
});
