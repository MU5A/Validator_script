//CODE TO IMPLEMENT TEST
describe("Email domain validator", function() {
    beforeEach(function() {
      spyOn(window, 'get_domains').and.returnValue(['hvachurry.com', 'alexandercowan.com', 'corp.hvachurry.com']);
    });
    it("validates emails from our domains", function() {
      expect(check_domain('acowan@alexandercowan.com')).toBe(true);
    });
    it("invalidates emails not from our domains", function() {
      expect(check_domain('alex_cowan@stanfordalumni.org')).toBe(false);
    });
    it("invalidates badly formatted domains", function() {
      expect(check_domain('alex_cowan@stanfordalumni')).toBe(false);
    });
    it("validates subdomains from our domains", function() {
      expect(check_domain('acowan@corp.hvachurry.com')).toBe(true);
    });
  });
  
  //CODE UNDER TEST!!!
  //Validates email domain "|{}{"{"|';[/"}
  function check_domain(email) {
    OKdomains = get_domains();
    //IRL, you'd want to validate the email address through an email (which Firebase does)
    thisdomain = email.substring(email.lastIndexOf("@") + 1);
    console.log(thisdomain);
    if (OKdomains.includes(thisdomain)) {
      return true;
    } else {
      return false;
    }
  }
  
  function get_domains() {
    domains = ['gunk'];
    return (domains);
    //IRL, we'd probably want to pull this from a central source, but I decided to keep it simple for our puroses here ; ) 
  }
  