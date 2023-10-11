import emailjs from '@emailjs/browser';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {useLoaderData} from '@remix-run/react';
import {getFormikKeys} from '../lib/utils';

export async function loader({context}) {
  const formikKeys = await getFormikKeys(context);
  return formikKeys;
}

export default function Contact() {
  const data = useLoaderData();
  const formik = useFormik({
    initialValues: {
      user_name: '', //user name
      user_email: '', // user email
      message: '', // message of email
    },
    validationSchema: Yup.object({
      user_name: Yup.string().required('* Name field is required'),
      user_email: Yup.string()
        .email('Invalid email address')
        .required('* Email field is required')
        .matches(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          '* Please enter a valid email address',
        ),
      message: Yup.string().required('* Message field is required'),
    }),
    onSubmit: (values, {setSubmitting, resetForm}) => {
      try {
        emailjs
          .send(data.SERVICE_ID, data.TEMPLATE_ID, values, data.PUBLIC_KEY)
          .then(() => {
            setSubmitting(false);
            // setMessageSent(true);
            // setMessageReceived(true);
            // setFlipped(false);
            resetForm();
            setTimeout(() => {
              // setMessageSent(false);
            }, 5000);
          });
      } catch {
        setSubmitting(false);
        // setMessageSent(true);
        // setMessageReceived(false);
        setTimeout(() => {
          // setMessageSent(false);
        }, 5000);
      }
    },
  });

  return (
    <div className="flex justify-center my-24 px-4 pointer-events-auto">
      <div className="max-w-md w-full">
        <h1 className="text-4xl">Contact Us</h1>
        <form onSubmit={formik.handleSubmit} className="mt-6 sm:mt-4">
          <div className="grid gap-6 sm:grid-cols-2 ">
            <div className="relative z-0">
              <input
                type="text"
                name="user_name"
                id="user_name"
                onChange={formik.handleChange}
                value={formik.values.user_name}
                // style={{pointerEvents: !flipped ? 'none' : 'auto'}}
                className="peer block w-full appearance-none border-0 border-b border-gray-500 bg-transparent py-2.5 px-2 text-white focus:border-[#f597e8] focus:outline-none focus:ring-0 caret-[#f597e8] "
                placeholder=""
              />
              <label className="absolute top-3 -z-10 origin-[0] -translate-y-7 scale-75 transform  text-white duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-7 peer-focus:italic peer-focus:scale-90 peer-focus:text-[#f597e8] peer-focus:dark:text-[#f597e8]">
                Your name
              </label>
              {formik.touched.user_name && formik.errors.user_name && (
                <div className="bg-[#220140] rounded text-red-400 text-[0.8rem] text-center py-1 mt-2">
                  {formik.errors.user_name}
                </div>
              )}
            </div>
            <div className="relative z-0">
              <input
                type="email"
                name="user_email"
                id="user_email"
                onChange={formik.handleChange}
                value={formik.values.user_email}
                // style={{pointerEvents: !flipped ? 'none' : 'auto'}}
                className="peer block w-full appearance-none border-0 border-b border-gray-500 bg-transparent py-2.5 px-2 text-white focus:border-[#f597e8] focus:outline-none focus:ring-0 caret-[#f597e8]"
                placeholder=""
              />
              <label className="absolute top-3 -z-10 origin-[0] -translate-y-7 scale-75 transform text-white duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-7 peer-focus:scale-90 peer-focus:italic peer-focus:text-[#f597e8] peer-focus:dark:text-[#f597e8]">
                Your email
              </label>
              {formik.touched.user_email && formik.errors.user_email && (
                <div className="bg-[#220140] rounded text-red-400 text-[0.8rem] text-center py-1 mt-2">
                  {formik.errors.user_email}
                </div>
              )}
            </div>
            {/* <div className="relative z-0">
              <input
                type="text"
                name="user_name"
                id="user_name"
                onChange={formik.handleChange}
                value={formik.values.user_name}
                // style={{pointerEvents: !flipped ? 'none' : 'auto'}}
                className="peer block w-full appearance-none border-0 border-b border-gray-500 bg-transparent py-2.5 px-2 text-white focus:border-[#f597e8] focus:outline-none focus:ring-0 caret-[#f597e8] "
                placeholder=""
              />
              <label className="absolute top-3 -z-10 origin-[0] -translate-y-7 scale-75 transform text-white duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-7 peer-focus:italic peer-focus:scale-90 peer-focus:text-[#f597e8] peer-focus:dark:text-[#f597e8]">
                Issue Cathegory
              </label>
              {formik.touched.user_name && formik.errors.user_name && (
                <div className="bg-[#220140] rounded text-red-400 text-[0.8rem] text-center py-1 mt-2">
                  {formik.errors.user_name}
                </div>
              )}
            </div> */}
            <div className="relative z-0 col-span-2">
              <textarea
                name="message"
                id="message"
                rows="5"
                onChange={formik.handleChange}
                value={formik.values.message}
                // style={{pointerEvents: !flipped ? 'none' : 'auto'}}
                className="peer block w-full h-[100px] sm:h-auto appearance-none border-0 border-b border-white bg-transparent py-2.5 px-2 text-white focus:border-[#f597e8] focus:outline-none focus:ring-0 resize-none overflow-y-auto caret-[#f597e8]"
                placeholder=" "
              ></textarea>
              <label className="absolute top-3 -z-10 origin-[0] -translate-y-7 scale-75 transform text-white duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-7 peer-focus:scale-90 peer-focus:italic peer-focus:text-[#f597e8] peer-focus:dark:text-[#f597e8]">
                Your message
              </label>
              {formik.touched.message && formik.errors.message && (
                <div className="bg-[#220140] rounded w-1/2 text-red-400 text-[0.8rem] text-center py-1 mt-2">
                  {formik.errors.message}
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            value="Send"
            disabled={formik.isSubmitting}
            className="bg-contrast text-primary/80 rounded py-2 px-4 focus:shadow-outline block w-full mt-5 hover:scale-105 hover:text-primary/100"
            // style={{pointerEvents: !flipped ? 'none' : 'auto'}}
          >
            {formik.isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
