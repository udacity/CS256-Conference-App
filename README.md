# Archival Note
This repository is deprecated; therefore, we are going to archive it.
However, learners will be able to fork it to their personal Github account but cannot submit PRs to this repository. If you have any issues or suggestions to make, feel free to:
- Utilize the https://knowledge.udacity.com/ forum to seek help on content-specific issues.
- Submit a support ticket along with the link to your forked repository if (learners are) blocked for other reasons. Here are the links for the [retail consumers](https://udacity.zendesk.com/hc/en-us/requests/new) and [enterprise learners](https://udacityenterprise.zendesk.com/hc/en-us/requests/new?ticket_form_id=360000279131).

Udacity Conf
============

So you want to run this thing?  We use Grunt (http://gruntjs.com/) for build steps, so you need to:

- install [NodeJS](http://nodejs.org/)
- install [Grunt](http://gruntjs.com/) using the command `npm install -g grunt-cli`
- run `grunt server` in the top-level directory of the app to test out on a local server.

This should automatically load the page in your browser. Instead of running `grunt server`, you can also try:

- running `grunt build` in the top-level directory of the app.
- run the Google AppEngine Launcher in the `dist/` directory that was created by the `grunt build` command
- open the page in your browser on `localhost`

You get the following with Grunt
- Live Reload, changes saved to your project will automatically reload the browser page if you're running `grunt server`.
- Auto-Prefixing (i.e. display: flex; will be old and new flexbox standards AND get vendor prefixed)
- Loads of other cool and useful stuff.... ;)
- Check out `Gruntfile.js` in order to check it out. Not the easiest going, but useful to learn.

An instance of this app is hosted, BTW, at http://udacity-conf.appspot.com/.
